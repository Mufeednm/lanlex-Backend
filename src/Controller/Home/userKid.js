
import Languages from "../../../Models/languages.js";
import User from "../../../Models/user.js";
import User_kids from "../../../Models/user_kids.js";
import Langauge_pref from "../../../Models/user_kids_langauge_pref.js";
import { sequelize } from "../../../config/database.js";


import path from 'path';
import fs from 'fs';
export const userKid_Registration = async (req, res) => {
    const { name, age, dob, school, city, country, languageId } = req.body;
    const userId = req.user.id;
    let t; // 🔧 DECLARE TRANSACTION VARIABLE OUTSIDE TRY BLOCK
    
    try {
        t = await sequelize.transaction(); // 🔁 START TRANSACTION

        // ✅ Validate languageId
        if (!Array.isArray(languageId)) {
            await t.rollback();
            return res.status(400).json({
                status: 400,
                error: true,
                message: 'languageId must be an array of integers',
                data: null
            });
        }

        // ✅ Check if kid already exists
        const existingKid = await User_kids.findOne({
            where: { name, age, dob },
            transaction: t
        });

        if (existingKid) {
            await t.rollback();
            return res.status(409).json({
                status: 409,
                error: true,
                message: 'Kid already registered with the same name, age, and date of birth',
                data: {   
                    existingKid_id: existingKid.kidId,
                    existingKid_name: existingKid.name, // 🔧 FIXED: was existingKid.kidId
                    existingKid_age: existingKid.age,
                    existingKid_dob: existingKid.dob,
                }
            });
        }

        // ✅ Create new kid
        const newKid = await User_kids.create({
            userId,
            name,
            age,
            dob,
            school,
            city,
            country
        }, { transaction: t });

        // ✅ Create language preferences
        const languagePrefs = languageId.map(id => ({
            kidId: newKid.kidId,
            languageId: id
        }));

        await Langauge_pref.bulkCreate(languagePrefs, { transaction: t });

        if (req.file) {
            // ✅ Process uploaded file
            const fileExt = path.extname(req.file.originalname); // .jpg, .png, etc.
            const dateFolder = new Date().toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).replace(/\//g, '');

            const baseDir = path.dirname(req.file.path); // src/uploads/user-kid-profiles
            const targetDir = path.join(baseDir, dateFolder);
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            const newFileName = `userkid_${newKid.kidId}${fileExt}`;
            const finalPath = path.join(targetDir, newFileName);
            const relativePath = `uploads/user-kid-profiles/${dateFolder}/${newFileName}`;

            // Move the file
            fs.renameSync(req.file.path, finalPath);

            // ✅ Optionally update image path in DB if your User_kids model supports it
            await newKid.update({
                picture: relativePath
            }, { transaction: t });
        }

        await t.commit(); // ✅ COMMIT TRANSACTION

        return res.status(200).json({
            status: 200,
            error: false,
            message: 'Kid registered successfully with language preferences',
            data: newKid
        });

    } catch (error) {
        // 🔧 CHECK IF TRANSACTION EXISTS BEFORE ROLLBACK
        if (t) {
            await t.rollback(); // ❌ ROLLBACK ON ERROR
        }
        console.error('Kid registration error:', error);
        return res.status(500).json({
            status: 500,
            error: true,
            message: 'Internal server error',
            data: {
                code: 'SERVER_ERROR',
                details: 'An error occurred during kid registration'
            }
        });
    }
};
export const userkid_list = async (req, res) => {
    try {
        const userId = req.user.id;
           // ✅ Check if kid already exists
     
           const existinguser = await User.findByPk(userId);

           if (!existinguser) {
            return res.status(409).json({
                status: 409,
                error: true,
                message: 'User not found',
                data:{}
            });       }

               // ✅ Check if kid already exists
               const kidsList = await User_kids.findAll({
                where: { userId: userId },
                include: [
                    {
                        model: Langauge_pref,
                        as: "languages" ,
                        attributes: ['languageId'],
                        include: [
                            {
                                model: Languages,
                                as: "language" ,
                                attributes: ['languageName'],
                                    
                            }
                        ]
                    }
                ]
            });
            
        console.log(kidsList);
        const formattedKids = kidsList.map(kid => {
            return {
              kidId: kid.kidId,
              name: kid.name,
              age: kid.age,
              dob: kid.dob,
              school: kid.school,
              city: kid.city,
              country: kid.country,
              picture: kid.picture,
              languages: kid.languages
                .filter(lang => lang.language !== null)
                .map(lang => ({
                  languageId: lang.languageId,
                  languageName: lang.language.languageName
                }))
            };
          });
        return res.status(200).json({
            status: 200,
            error: false,
            message: 'List of User Kid List',
            data: formattedKids
        });
           
    } catch (error) {
        return res.status(500).json({
            status: 500,
            error: true,
            message: 'Internal server error',
            data: {
                code: 'SERVER_ERROR',
                details: 'An error occurred during List of User Kid List'
            }
        });
    }
}
