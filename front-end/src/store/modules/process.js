import axios from 'axios';
import { make } from 'vuex-pathify';

const state = {
    tce: {
        unidadeConcedente: {
            razaoSocial: null,
            cnpj: null,
            setor: null,
            fone: null,
            endereco: null,
            cep: null,
            cidade: null,
            uf: null,
            representanteLegal: null,
            supervisor: {
                nome: null,
                cargo: null,
                email: null,
            },
        },
        estagiario: {
            name: null,
            rg: null,
            login: null,
            matricula: null,
            mae: null,
            fone: null,
            endereco: null,
            cidade: null,
            uf: null,
            course: null,
            semestre: null,
            email: null,
        },
        orientador: {
            name: null,
            login: null,
        },
        estagio: {
            dataInicio: null,
            dataFim: null,
            valorBolsa: null,
            valorAuxilioTransporte: null,
            cargaHorariaSemanal: null,
            componenteCurricular: null,
            horarios: [],
            atividadesPrevistas: null,
        }
    },
    process: {
        id: null,
        steps: {
            currentStep: {
                step: "sigaaRegistration",
                position: 1
            },
            sigaaRegistration: {
                isFinished: false,
                isSubmitted: false,
                isApproved: false,
                completedDate: null,
                documentSubmittedDate: null,
                documentApprovedDate: null,
                documentPath: null,
            },
            documentation: {
                isFinished: false,
                isSubmitted: false,
                isApproved: false,
                completedDate: null,
                documentSubmittedDate: null,
                documentApprovedDate: null,
                documentPath: null,
            },
            internshipPlan: {
                isFinished: false,
                isSubmitted: false,
                isApproved: false,
                completedDate: null,
                documentSubmittedDate: null,
                documentApprovedDate: null,
                documentPath: null,
            },
            performanceEvaluation: {
                isFinished: false,
                isSubmitted: false,
                isApproved: false,
                completedDate: null,
                documentSubmittedDate: null,
                documentApprovedDate: null,
                documentPath: null,
            },
            report: {
                isFinished: false,
                isSubmitted: false,
                isApproved: false,
                completedDate: null,
                documentSubmittedDate: null,
                documentApprovedDate: null,
                documentPath: null,
            },
            workshop: {
                isFinished: false,
                isSubmitted: false,
                isApproved: false,
                completedDate: null,
                documentSubmittedDate: null,
                documentApprovedDate: null,
                documentPath: null,
            },
        },
        type: null,
    },
    steppers: {
        showTceUploader: false,
        showTceEditor: false,
        showCltPjDocumentationUploader: false,
        showInternshipPlanUploader: false,
        showPerformanceEvaluationUploader: false,
        showFinalReportUploader: false,
    }
}

const mutations = {
    ...make.mutations(state),

    process: (state, process) => {
        state.process = process;
        state.steppers.showTceUploader = !process.steps.documentation.isSubmitted;
        state.steppers.showTceEditor = !process.steps.documentation.isSubmitted;
        state.steppers.showCltPjDocumentationUploader = !process.steps.documentation.isSubmitted;
        state.steppers.showInternshipPlanUploader = !process.steps.internshipPlan.isSubmitted && process.steps.currentStep.step === 'internshipPlan';
        state.steppers.showPerformanceEvaluationUploader = !process.steps.performanceEvaluation.isSubmitted && process.steps.currentStep.step === 'performanceEvaluation';
        state.steppers.showFinalReportUploader = !process.steps.report.isSubmitted && process.steps.currentStep.step === 'report';
    }
};

const actions = {
    uploadDocumentation: ({commit}, documentFile) => {
        return new Promise((resolve, reject) => {
            let formData = new FormData();
            formData.append("documentFile", documentFile)

            axios.post('/process/documentation', formData)
            .then(res => {
                if (res.data.success) {
                    commit('process', res.data.process);
                } else {
                    reject(new Error(res.data.message));
                }
            })
            .catch(error => {
                const errorMessage = error && error.response && error.response.data && error.response.data.message;

                reject(new Error(errorMessage));
            })
            .finally(() => resolve())
        });
    },
    getProcess: ({commit}) => {
        return new Promise((resolve, reject) => {
            axios.get('/process')
            .then(res => {
                commit('process', res.data);
            })
            .catch(error => {
                const errorMessage = error && error.response && error.response.data && error.response.data.message;

                reject(new Error(errorMessage));
            })
            .finally(() => resolve())
        });
    },
    getTce: ({commit}) => {
        return new Promise((resolve, reject) => {
            axios.get('/process/documentation/tce')
            .then(res => {
                commit('tce', res.data);
            })
            .catch(error => {
                const errorMessage = error && error.response && error.response.data && error.response.data.message;

                reject(new Error(errorMessage));
            })
            .finally(() => resolve())
        });
    },
    saveTce: ({commit}, tce) => {
        return new Promise((resolve, reject) => {
            axios.patch(`/process/documentation/tce/${tce.id}`, tce)
            .then(res => {
                if (res.data.success) {
                    commit('tce', tce);
                } else {
                    reject(new Error(res.data.message));
                }
            })
            .catch(error => {
                const errorMessage = error && error.response && error.response.data && error.response.data.message;

                reject(new Error(errorMessage));
            })
            .finally(() => resolve())
        });
    },
    generateTce: () => {
        return new Promise((resolve, reject) => {
            axios.get('/process/documentation/tce/download', { responseType: 'blob' })
            .then((res) => {
                resolve([res.data]);
            })
            .catch(error => {
                const errorMessage = error && error.response && error.response.data && error.response.data.message;

                reject(new Error(errorMessage));
            })
        });
    },
    confirmSigaaRegistration: ({commit}) => {
        return new Promise((resolve, reject) => {
            axios.post('/process/sigaaRegistration/confirm')
            .then(res => {
                if (res.data.success) {
                    commit('process', res.data.process);
                } else {
                    reject(new Error(res.data.message));
                }
            })
            .catch(error => {
                const errorMessage = error && error.response && error.response.data && error.response.data.message;

                reject(new Error(errorMessage));
            })
            .finally(() => resolve())
        });
    },
    setInternshipType: ({commit}, internshipType) => {
        return new Promise((resolve, reject) => {
            axios.post('/process/internshipType', { internshipType })
            .then(res => {
                if (res.data.success) {
                    commit('process', res.data.process);
                } else {
                    reject(new Error(res.data.message));
                }
            })
            .catch(error => {
                const errorMessage = error && error.response && error.response.data && error.response.data.message;

                reject(new Error(errorMessage));
            })
            .finally(() => resolve())
        });
    },
};

const getters = {
    ...make.getters(state)
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};