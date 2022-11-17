/* eslint-disable no-underscore-dangle */
const { Schema, Types, model } = require('mongoose');
const User = require('./user');
const Steps = require('../utils/steps.json');

const StepSchema = new Schema({
    isFinished: { type: Boolean, default: false },
    isSubmitted: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    completedDate: { type: Date, default: null },
    documentSubmittedDate: { type: Date, default: null },
    documentApprovedDate: { type: Date, default: null },
    documentPath: { type: String, default: null },
    _id: false,
});

const CurrentStepSchema = new Schema({
    step: { type: String, default: 'sigaaRegistration' },
    position: { type: Number, default: 1 },
    _id: false,
});

const StepsSchema = new Schema({
    currentStep: { type: CurrentStepSchema, default: {} },
    sigaaRegistration: { type: StepSchema, default: {} },
    documentation: { type: StepSchema, default: {} },
    internshipPlan: { type: StepSchema, default: {} },
    performanceEvaluation: { type: StepSchema, default: {} },
    report: { type: StepSchema, default: {} },
    workshop: { type: StepSchema, default: {} },
    _id: false,
});

const ProcessSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User' },
    coordinator: { type: Schema.Types.ObjectId, ref: 'User' },
    tce: { type: Schema.Types.ObjectId, ref: 'TCE' },
    type: { type: String, default: null },
    steps: { type: StepsSchema, default: {} },
}, {
    timestamps: true,
});

ProcessSchema.methods.getPojoSchema = async function getPojoSchema() {
    const process = this.toObject();

    // eslint-disable-next-line no-underscore-dangle
    process.id = process._id;

    ['tce', 'student', 'coordinator', 'createdAt', 'updatedAt', '__v', '_id'].forEach((attribute) => {
        process[attribute] = undefined;
    });

    return process;
};

ProcessSchema.methods.confirmSigaaRegistration = async function confirmSigaaRegistration() {
    const currentStep = this.steps.currentStep.step;

    if (currentStep !== Steps.SIGAA_REGISTRATION.step) {
        return {
            success: false,
            message: 'A etapa de confirmação de matricula no SIGAA já foi concluída anteriormente.',
        };
    }

    this.steps.currentStep.step = Steps.DOCUMENTATION.step;
    this.steps.currentStep.position = Steps.DOCUMENTATION.position;
    this.steps[currentStep].isFinished = true;
    this.steps[currentStep].completedDate = new Date();

    await this.save();

    const pojoSchema = await this.getPojoSchema();

    return {
        success: true,
        process: pojoSchema,
    };
};

ProcessSchema.methods.setInternshipType = async function setInternshipType(internshipType) {
    const currentStep = this.steps.currentStep.step;

    if (currentStep !== Steps.DOCUMENTATION.step) {
        return {
            success: false,
            message: 'A etapa de documentação já foi concluída anteriormente.',
        };
    }

    this.type = internshipType;

    await this.save();

    const pojoSchema = await this.getPojoSchema();

    return {
        success: true,
        process: pojoSchema,
    };
};

ProcessSchema.methods.setDocumentPath = async function setDocumentPath(fileUploadedInfo) {
    const currentStepId = this.steps.currentStep.step;
    const currentStep = this.steps[currentStepId];

    if (currentStepId === Steps.SIGAA_REGISTRATION.step || currentStep.isApproved) {
        return {
            success: false,
            message: 'Não é possível anexar documentação nessa etapa do processo.',
        };
    }

    currentStep.isSubmitted = true;
    currentStep.documentSubmittedDate = new Date();
    currentStep.documentPath = `uploads/documentation/${fileUploadedInfo.filename}`;

    await this.save();

    const pojoSchema = await this.getPojoSchema();

    return {
        success: true,
        process: pojoSchema,
    };
};

ProcessSchema.methods.approveDocumentation = async function approveDocumentation() {
    const currentStepId = this.steps.currentStep.step;
    const currentStepPosition = this.steps.currentStep.position;
    const currentStep = this.steps[currentStepId];

    // eslint-disable-next-line max-len
    if (currentStepId === Steps.SIGAA_REGISTRATION.step || currentStepId === Steps.COMPLETED.step || !currentStep.isSubmitted
        || currentStep.isApproved) {
        return {
            success: false,
            message: 'Não é possível aprovar a documentação desse processo.',
        };
    }

    currentStep.isApproved = true;
    currentStep.isFinished = true;
    currentStep.completedDate = new Date();
    currentStep.documentApprovedDate = new Date();

    // eslint-disable-next-line max-len
    const nextStep = Object.keys(Steps).find((step) => Steps[step].position === currentStepPosition + 1);

    if (nextStep) {
        this.steps.currentStep = Steps[nextStep];

        if (Steps[nextStep].step === Steps.WORKSHOP.step) {
            this.steps.workshop.isSubmitted = true;
            this.steps.workshop.documentSubmittedDate = new Date();
            this.steps.workshop.documentPath = '';
        }
    }

    await this.save();

    const pojoSchema = await this.getPojoSchema();

    return {
        success: true,
        process: pojoSchema,
    };
};

ProcessSchema.methods.isResourceOwner = function isResourceOwner(req) {
    const currentUserId = Types.ObjectId(req.userData.id);

    return currentUserId.equals(this.student) || currentUserId.equals(this.coordinator);
};

ProcessSchema.statics.createProcessForCurrentUser = async function createProcess(req) {
    const Process = this;
    const { course } = req.userData;
    const courseCoordinator = await User.findCoordinators({ course });

    const processData = {
        student: Types.ObjectId(req.userData.id),
        coordinator: courseCoordinator && courseCoordinator.id,
    };

    return new Process(processData);
};

ProcessSchema.statics.getProcessFromCurrentUser = async function get(req, returnMongoDocument) {
    const { id } = req.userData;
    const process = await this
        .findOne({ student: Types.ObjectId(id) });

    if (!process) {
        return null;
    }

    if (returnMongoDocument) {
        return process;
    }

    return process.getPojoSchema();
};

const Process = model('Process', ProcessSchema);

module.exports = Process;
