module.exports = (app, utils) => {
    app.post("/api/v1/users/setEmail", async (req, res) => {
        const packet = req.body;

        const username = (String(packet.username)).toLowerCase();
        const token = packet.token;

        const email = packet.email;

        const validateEmail = (email) => {
            return email.match(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        };

        if (!username || !token || typeof email !== "string") {
            utils.error(res, 400, "InvalidData");
            return;
        }

        if (!utils.UserManager.loginWithToken(username, token)) {
            utils.error(res, 400, "Reauthenticate");
            return;
        }

        if (!validateEmail(email)) {
            utils.error(res, 400, "InvalidEmail");
            return;
        }

        if (await utils.UserManager.emailInUse(email)) {
            utils.error(res, 400, "EmailInUse");
            return;
        }

        await utils.UserManager.setEmail(username, email);

        res.status(200);
        res.header("Content-Type", 'application/json');
        res.send({ "success": true });
    });
}