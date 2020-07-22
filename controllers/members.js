// Using file system for local data saving
const fs = require('fs');
const data = require('../data.json');
const { age, date } = require('../src/utils');

/**
 * Returns member create view
 * @param {Object} req - Body Request
 * @param {Object} res - Response
 * @returns {View}
 */
exports.create = (req, res) => {
    return res.render('members/create');
}

/**
 * Store a newly member into data.json
 * @param {Object} req - Body Request
 * @param {Object} res - Response
 * @returns {Redirect} - Redirects to members view
 */
exports.post = (req, res) => {
    const keys = Object.keys(req.body);

    keys.map(key => {
        if (req.body[key] === "") {
            res.send({ Error: "Por favor preencha todos os campos" });
        }
    });

    birth = Date.parse(req.body.birth);

    let id = 1;
    const lastMember = data.members[data.members.length - 1];

    if (lastMember) {
        id = lastMember.id + 1;
    }

    data.members.push({
        ...req.body,
        id,
        birth,
    });

    fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
        if (err) return res.send({ Error: "Erro ao salvar os dados" });

        return res.redirect('members');
    });
}

/**
 * Render a list of members
 * @param {Object} req - Body Request
 * @param {Object} res - Response
 * @returns {View} - Render index view
 */
exports.list = (req, res) => {
    return res.render('members/index', { members: data.members });
}

/**
 * Show a single member
 * @param {Object} req - Body Request
 * @param {Object} res - Response
 * @returns {View} - Render a single member view
 */
exports.show = (req, res) => {
    const { id } = req.params;

    const foundMember = data.members.find(
        member => member.id == id
    );

    if (!foundMember) return res.send({ Error: "Member not found" });

    const member = {
        ...foundMember,
        age: age(foundMember.birth),
    };

    return res.render('members/show', { member });
}

/**
 * Render member edit view
 * @param {Object} req - Body Request
 * @param {Object} res - Response
 * @returns {View} - Render member edit view
 */
exports.edit = (req, res) => {
    const { id } = req.params;

    const foundMember = data.members.find(
        member => member.id == id
    );

    if (!foundMember) return res.send({ Error: "Member not found" });

    const member = {
        ...foundMember,
        birth: date(foundMember.birth)
    };

    return res.render('members/edit', { member });
}

/**
 * Update a member with put http verb
 * @param {Object} req - Body Request
 * @param {Object} res - Response
 * @returns {View} - Show de edited member view
 */
exports.put = (req, res) => {
    const { id } = req.body;

    let index = 0;

    const foundMember = data.members.find((member, foundIndex) => {
        if (id == member.id) {
            index = foundIndex
            return true
        }
    });

    if (!foundMember) return res.send({ Error: 'Member not found.' });

    const member = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id),
    };

    data.members[index] = member;

    fs.writeFile('data.json', JSON.stringify(data, null, 2), err => {
        if (err) return res.send({ Error: 'Could not save data, try again' })

        return res.redirect(`/members/${id}`)
    });
}

/**
 * Delete a single member from storage data.json
 * @param {Object} req - Body Request
 * @param {Object} res - Response
 * @returns {Redirect} - Redirect to members view
 */
exports.delete = (req, res) => {
    const { id } = req.body;

    const filteredMember = data.members.filter(
        member => member.id != id
    );

    data.members = filteredMember;

    fs.writeFile('data.json', JSON.stringify(data, null, 2), err => {
        if (err) return res.send({Error: 'Could not delete member, please try again'}, console.log(err))

        return res.redirect('/members')
    });
}
