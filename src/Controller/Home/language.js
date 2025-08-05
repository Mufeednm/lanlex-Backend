
import Languages from "../../../Models/languages.js";
import User from "../../../Models/user.js";







  export const allLanguages = async (req, res) => {
  
    try {
        // Validate required fields
        
        const allLang = await Languages.findAll({
          where: {
            status: "Active",
   
          }
        });



       
        return res.status(200).json({
            status: 200,
            error: false,
            message: 'List of Languages',
            data: allLang,
              
            
        });

    } catch (error) {
        console.error('OTP verification error:', error);
        return res.status(500).json({
            status: 500,
            error: true,
            message: 'Internal server error',
            data: {
                code: 'SERVER_ERROR',
                details: 'An error occurred during OTP verification'
            }
        });
    }
};



