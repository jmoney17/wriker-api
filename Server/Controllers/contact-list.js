"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessDeletePage = exports.ProcessEditPage = exports.ProcessAddPage = exports.DisplayEditPage = exports.DisplayAddPage = exports.DisplayContactListPage = void 0;
const contact_1 = __importDefault(require("../Models/contact"));
function DisplayContactListPage(req, res, next) {
    contact_1.default.find((err, contactsCollection) => {
        if (err) {
            console.error('Encountered an Error reading from the Database:' + err.message);
            res.end(err);
        }
        res.json({ success: true, msg: 'Contact Page Displayed Successfully', contacts: contactsCollection, user: req.user });
    });
}
exports.DisplayContactListPage = DisplayContactListPage;
function DisplayAddPage(req, res, next) {
    res.json({ success: true, msg: 'Add Page Displayed Successfully', user: req.user });
}
exports.DisplayAddPage = DisplayAddPage;
function DisplayEditPage(req, res, next) {
    let id = req.params.id;
    contact_1.default.findById(id, {}, {}, (err, contactToEdit) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.json({ success: true, msg: 'Edit Page Displayed Successfully', contact: contactToEdit, user: req.user });
    });
}
exports.DisplayEditPage = DisplayEditPage;
function ProcessAddPage(req, res, next) {
    let newContact = new contact_1.default({
        "FullName": req.body.FullName,
        "ContactNumber": req.body.ContactNumber,
        "EmailAddress": req.body.EmailAddress
    });
    contact_1.default.create(newContact, (err) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.json({ success: true, msg: 'Contact Added Successfully', contact: newContact, user: req.user });
    });
}
exports.ProcessAddPage = ProcessAddPage;
function ProcessEditPage(req, res, next) {
    let id = req.params.id;
    let updatedContact = new contact_1.default({
        "_id": id,
        "FullName": req.body.FullName,
        "ContactNumber": req.body.ContactNumber,
        "EmailAddress": req.body.EmailAddress
    });
    contact_1.default.updateOne({ _id: id }, updatedContact, (err) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.json({ success: true, msg: 'Contact Edited Successfully', contact: updatedContact, user: req.user });
    });
}
exports.ProcessEditPage = ProcessEditPage;
function ProcessDeletePage(req, res, next) {
    let id = req.params.id;
    contact_1.default.deleteOne({ _id: id }, (err) => {
        if (err) {
            console.error(err);
            res.end(err);
        }
        res.json({ success: true, msg: 'Contact Deleted Successfully', contactID: id, user: req.user });
    });
}
exports.ProcessDeletePage = ProcessDeletePage;
//# sourceMappingURL=contact-list.js.map