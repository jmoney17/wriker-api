import express, { Request, Response, NextFunction } from 'express';

import Contact from '../Models/contact';

// Display Functions
export function DisplayContactListPage(req: Request, res: Response, next: NextFunction):void
{
    Contact.find((err, contactsCollection) => {
        if (err) {
          console.error('Encountered an Error reading from the Database:' + err.message);
          res.end(err);
        }

        res.json({ success: true, msg: 'Contact Page Displayed Successfully', contacts: contactsCollection, user: req.user });
      });
}

export function DisplayAddPage(req: Request, res: Response, next: NextFunction):void
{
  res.json({success: true, msg: 'Add Page Displayed Successfully', user: req.user}); 
}

export function DisplayEditPage(req: Request, res: Response, next: NextFunction):void
{
    let id = req.params.id;

    // pass the id to the db and read the contact in
    Contact.findById(id, {}, {}, (err, contactToEdit) => {
        if (err) {
          console.error(err);
          res.end(err);
        }

        // show the edit view with the data
        res.json({ success: true, msg: 'Edit Page Displayed Successfully', contact: contactToEdit, user: req.user });
      });
}

// Process Functions
export function ProcessAddPage(req: Request, res: Response, next: NextFunction):void
{
    // instantiate a new  contact to add
    let newContact = new Contact
    ({
      "FullName": req.body.FullName,
      "ContactNumber": req.body.ContactNumber,
      "EmailAddress": req.body.EmailAddress
    });

    // insert contact into db
    Contact.create(newContact, (err) => {
        if (err) {
          console.error(err);
          res.end(err);
        }

        // newContact has been added to the db -> go to the contact-list
        res.json({ success: true, msg: 'Contact Added Successfully', contact: newContact, user: req.user });
      });
}

export function ProcessEditPage(req: Request, res: Response, next: NextFunction):void
{
    let id = req.params.id;

    // instantiate a new contact to edit
    let updatedContact = new Contact
    ({
      "_id": id,
      "FullName": req.body.FullName,
      "ContactNumber": req.body.ContactNumber,
      "EmailAddress": req.body.EmailAddress
    });
  
    // db.contacts.update
    Contact.updateOne({_id:id}, updatedContact, (err: ErrorCallback) => {
        if (err) {
          console.error(err);
          res.end(err);
        }

        // edit was successful -> go to the contact-list page
        res.json({ success: true, msg: 'Contact Edited Successfully', contact: updatedContact, user: req.user });
      }); 
}

export function ProcessDeletePage(req: Request, res: Response, next: NextFunction):void
{
    let id = req.params.id;

    // pass the id to the db and delete the contact
    Contact.deleteOne({_id: id}, (err) => {
        if (err) {
          console.error(err);
          res.end(err);
        }

        // delete was successful
        res.json({ success: true, msg: 'Contact Deleted Successfully', contactID: id, user: req.user });
      });
}