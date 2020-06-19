/**
 * Using file system for local data saving
 * Moment Js for date validations
 */
const fs = require('fs');
const data = require('../data.json');
const { age, date } = require('./utils');
const moment = require('moment');

/* Create */
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
    let { avatar_url, birth, name, services, gender } = req.body;

    /**
     * Validating dates with Moment.JS to pt-br standards
     * Using an id incrementation to data entries in data.json
     */
    birth = Date.parse(birth);
    const created_at = moment().locale('pt-br').format('l');
    const id = Number(data.instructors.length + 1);


    // pushing data from req.body to instructors array
    data.instructors.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at
    });

    // save data to data.json
    fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
        if (err) return res.send({ Error: "Erro ao salvar os dados" });

        return res.redirect('instructors');
    });
}

/* Show */
exports.show = (req, res) => {
    //Get id from params (url)
    const { id } = req.params;

    //Fetch and return the first value that matches the condition from data.json
    const foundInstructor = data.instructors.find(
        instructor => instructor.id == id
    );

    //Send error msg if instructor wasn't found
    if (!foundInstructor) return res.send({ Error: "Instructor not found" });

    /*
    * Spread foundInstructor object into instructor
    * and update age and services keys to format it properly
    */
    const instructor = {
        ...foundInstructor,
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(','),
    };

    //Send the object instructor to render data in page
    return res.render('instructors/show', { instructor });
}

/* Update */
exports.edit = (req, res) => {
    const { id } = req.params;

    // Find a instructor by it id
    const foundInstructor = data.instructors.find(
        instructor => instructor.id == id
    );

    // Conditional to show error if was not found an instructor
    if (!foundInstructor) return res.send({ Error: "Instructor not found" });

    // Spread the found instructor into an object
    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth)
    };

    // Send the instructor object to /edit route
    return res.render('instructors/edit', { instructor });
}

/* Put */
exports.put = (req, res) => {
    // Get the instructor id from request body
    const { id } = req.body;

    // Index variable to know which instructor is being edited
    let index = 0;

    // Fetch for instructor and assign its position to index variable
    const foundInstructor = data.instructors.find((instructor, foundIndex) => {
        if (id == instructor.id) {
            index = foundIndex
            return true
        }
    });

    // Verify if the instructor exists
    if (!foundInstructor) return res.send({ Error: 'Instructor not found.' });

    // Spread data into instructor object
    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth),
    };

    // Assign data to instructors according to its index
    data.instructors[index] = instructor;

    // Save the new edited data to file
    fs.writeFile('data.json', JSON.stringify(data, null, 2), err => {
        if (err) return res.send({ Error: 'Could not save data, try again' })

        return res.redirect(`/instructors/${id}`)
    });
}

/* Delete */
exports.delete = (req, res) => {
    const { id } = req.body;

    // filter that won't be deleted
    const filteredInstructor = data.instructors.filter(
        instructor => instructor.id != id
    );

    data.instructors = filteredInstructor;

    fs.writeFile('data.json', JSON.stringify(data, null, 2), err => {
        if (err) return res.send({Error: 'Could not delete instructor, please try again'}, console.log(err))

        return res.redirect('/instructors')
    });
}
