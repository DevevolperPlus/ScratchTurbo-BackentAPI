module.exports = (app, utils) => {
    app.post('/api/v1/projects/canviewprojects', async (req, res) => {
        const packet = req.body;

        const username = (String(packet.username)).toLowerCase();
        const token = packet.token;

        const toggle = packet.toggle;

        if (!username || !token || !toggle) {
            return utils.error(res, 400, "InvalidData");
        }

        if (!await utils.UserManager.loginWithToken(username, token)) {
            return utils.error(res, 401, "Invalid credentials");
        }

        if (!await utils.UserManager.isAdmin(username)) {
            return utils.error(res, 401, "Invalid credentials");
        }

        const viewing = utils.env.ViewingEnabled 

        return res.send({ viewing: viewing });
    });
}