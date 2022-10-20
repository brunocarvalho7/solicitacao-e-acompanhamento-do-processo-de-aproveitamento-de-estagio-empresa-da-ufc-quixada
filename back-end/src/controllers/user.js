const User = require('../models/user');

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

        const token = user.generateAuthToken();

        return res.status(200).json({
            user: user.getPojoSchema(),
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            message: error.message,
        });
    }
};

exports.returnUserProfile = function returnUserProfile(req, res) {
    res.json(req.userData);
};
