/**
 * Using file system for local data saving
 * Moment Js for date validations
 */
const fs = require('fs');
const data = require('../data.json');
const { age, date } = require('../src/utils');
const moment = require('moment');

/**
 * Returns member create view
 * @param {Object} req - Body Request
 * @param {Object} res - Response *
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
    // constructor for form validation by getting the keys of req.body object
    const keys = Object.keys(req.body);

    // check for empty values in form fields
    keys.map(key => {
        if (req.body[key] === "") {
            res.send({ Error: "Por favor preencha todos os campos" });
        }
    });

    // destructuring req.body
    let { avatar_url, birth, name, gender } = req.body;

    /**
     * Validating dates with Moment.JS to pt-br standards
     * Using an id incrementation to data entries in data.json
     */
    birth = Date.parse(birth);
    const created_at = moment().locale('pt-br').format('l');
    const id = Number(data.members.length + 1);


    // pushing data from req.body to members array
    data.members.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        created_at
    });

    // save data to data.json
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
    // Render index view and send object members with data.members value
    return res.render('members/index', { members: data.members });
}

/**
 * Show a single member
 * @param {Object} req - Body Request
 * @param {Object} res - Response
 * @returns {View} - Render a single member view
 */
exports.show = (req, res) => {
    //Get id from params (url)
    const { id } = req.params;

    //Fetch and return the first value that matches the condition from data.json
    const foundMember = data.members.find(
        member => member.id == id
    );

    //Send error msg if member wasn't found
    if (!foundMember) return res.send({ Error: "Member not found" });

    /*
    * Spread foundMember object into member
    * and update age key to format it properly
    */
    const member = {
        ...foundMember,
        age: age(foundMember.birth),
    };

    //Send the object member to render data in page
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

    // Find a member by it id
    const foundMember = data.members.find(
        member => member.id == id
    );

    // Conditional to show error if was not found an member
    if (!foundMember) return res.send({ Error: "Member not found" });

    // Spread the found member into an object
    const member = {
        ...foundMember,
        birth: date(foundMember.birth)
    };

    // Send the member object to /edit route
    return res.render('members/edit', { member });
}

/**
 * Update a member with put http verb
 * @param {Object} req - Body Request
 * @param {Object} res - Response
 * @returns {View} - Show de edited member view
 */
exports.put = (req, res) => {
    // Get the member id from request body
    const { id } = req.body;

    // Index variable to know which member is being edited
    let index = 0;

    // Fetch for member and assign its position to index variable
    const foundMember = data.members.find((member, foundIndex) => {
        if (id == member.id) {
            index = foundIndex
            return true
        }
    });

    // Verify if the member exists
    if (!foundMember) return res.send({ Error: 'Member not found.' });

    // Spread data into member object
    const member = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id),
    };

    // Assign data to members according to its index
    data.members[index] = member;

    // Save the new edited data to file
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

    // filter that won't be deleted
    const filteredMember = data.members.filter(
        member => member.id != id
    );

    data.members = filteredMember;

    fs.writeFile('data.json', JSON.stringify(data, null, 2), err => {
        if (err) return res.send({Error: 'Could not delete member, please try again'}, console.log(err))

        return res.redirect('/members')
    });
}
