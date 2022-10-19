const User = require('../models/user');

exports.registerNewUser = async function (req, res) {
    try {
        const isEmailAlreadyInUse = await User.isEmailAlreadyInUse(req.body.email);

        if (isEmailAlreadyInUse) {
            return res.status(409).json({
                message: 'Atenção! Este e-mail já possui registro!'
            });
        }

        const newUser = new User(req.body);
        const user = await newUser.save();
        const token = await newUser.generateAuthToken();

        return res.status(201).json({
            message: "Usuário criado com sucesso!",
            user,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            message: error.message
        })
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { login, password } = req.body;

        const authenticationResult = await User.authenticateUser(login, password);

        if (!authenticationResult.success) {
            if (authenticationResult.isAccessDenied) {
                return res.status(401).json({
                    message: 'Erro ao Logar! Verifique as suas credenciais de autenticação.',
                });
            }

            return res.status(500).json({
                message: `Erro interno no servidor. Tente novamente mais tarde. Detalhes: ${authenticationResult.message}`,
            });
        }

        const { user } = authenticationResult;

        const token = await user.generateAuthToken();

        return res.status(200).json({
            user,
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            message: error.message,
        });
    }
};

exports.returnUserProfile = function (req, res) {
    res.json(req.userData);
};
