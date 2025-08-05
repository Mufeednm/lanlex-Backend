import axios from "axios";
import User from "../../../Models/user.js";
import jwt from 'jsonwebtoken';


export const login = async (req, res) => {
    const { mobileNumber } = req.body;
  
  
    // ✅ Basic Validation
    if (!mobileNumber) {
      return res.status(401).json({
        status: 401,
        error: true,
        message: "Mobile number is required",
        data: {},
      });
    }
  
    try {
            // ✅ Find user with integer comparison
      const user = await User.findOne({ 
        where: { mobileNumber: mobileNumber } 
      });
      
    
      if (!user) {
        console.log("User not found");
        return res.status(200).json({
          status: 200,
          error: false,
          message: "User does not exist",
          data: { customerType: "New" },
        });
      }
  
      const otp = Math.floor(100000 + Math.random() * 900000);
      await user.update({ otp });
  
       const formattedPhone = mobileNumber.replace(/\D/g, "").slice(-10);
       if (formattedPhone.length !== 10) {
         return res.status(400).json({
           status: 400,
           error: true,
           message: "Invalid phone number format",
           data: {
             code: "INVALID_PHONE",
             details: "Phone number must have 10 digits after removing country code",
           },
         });
       }
  const smsData = {
    From: process.env.SMS_FROM_NAME,
    To: formattedPhone,
    TemplateName: "OTP_TO_CUSTOMER",
    VAR1: "User",
    VAR2: otp,
    VAR3: "LANGLEX",
  };

  const smsResponse = await axios.post(
    `https://2factor.in/API/V1/${process.env.SMS_API_KEY}/ADDON_SERVICES/SEND/TSMS`,
    smsData
  );

  console.log("📩 2Factor OTP Response:", smsResponse.data);

  if (smsResponse.data.Status !== "Success") {
    return res.status(500).json({
      status: 500,
      error: true,
      message: "OTP sending failed",
      data: smsResponse.data,
    });
  } 
     // ✅ Final success response
     return res.status(200).json({
        status: 200,
        error: false,
        message: " OTP sent successfully",
        data: {
          user: {
            id: user.userId,
          }
        },
      });

      // ... rest of your SMS logic
    } catch (error) {
      console.error("❌ Login error:", error);
      return res.status(500).json({
        status: 500,
        error: true,
        message: "Internal server error",
        data: {
          code: "SERVER_ERROR",
          details: error.message || "Login process failed",
        },
      });
    }
  };


export const signin = async (req, res) => {
    try {
      const { userName, emailAddress, mobileNumber } = req.body;
  
      // ✅ Field validation
      const missingField = !mobileNumber
        ? 'mobileNumber'
        : !userName
        ? 'userName'
        : !emailAddress
        ? 'emailAddress'
        : null;
  
      if (missingField) {
        return res.status(400).json({
          status: 400,
          error: true,
          message: `${missingField} is required`,
          data: {},
        });
      }
  
      // ✅ Validate phone format
      const formattedPhone = mobileNumber.replace(/\D/g, "").slice(-10);
      if (formattedPhone.length !== 10) {
        return res.status(400).json({
          status: 400,
          error: true,
          message: "Invalid phone number format",
          data: {
            code: "INVALID_PHONE",
            details: "Phone number must have 10 digits after removing country code",
          },
        });
      }
  
      // ✅ Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
  
      // ✅ Create user with OTP
      const user = await User.create({
        userName,
        emailAddress,
        mobileNumber,
        otp,
      });
  
      // ✅ Prepare 2Factor SMS payload
      const smsData = {
        From: process.env.SMS_FROM_NAME,
        To: formattedPhone,
        TemplateName: "OTP_TO_CUSTOMER",
        VAR1: "User",
        VAR2: otp,
        VAR3: "LANGLEX",
      };
  
      // ✅ Send OTP
      const smsResponse = await axios.post(
        `https://2factor.in/API/V1/${process.env.SMS_API_KEY}/ADDON_SERVICES/SEND/TSMS`,
        smsData
      );
  
      console.log("📩 2Factor OTP Response:", smsResponse.data);
  
      if (smsResponse.data.Status !== "Success") {
        return res.status(500).json({
          status: 500,
          error: true,
          message: "OTP sending failed",
          data: smsResponse.data,
        });
      }
  
      // ✅ Final success response
      return res.status(201).json({
        status: 201,
        error: false,
        message: "User created & OTP sent successfully",
        data: {
          user: {
            id: user.userId,
          }
        },
      });
  
    } catch (error) {
      console.error("❌ Signin error:", error);
  
      return res.status(500).json({
        status: 500,
        error: true,
        message: "Internal server error",
        data: {
          details: error.message || "Something went wrong in SignIn",
        },
      });
    }
  };



  export const verifyotp = async (req, res) => {
    const {  id, otp } = req.body;

    try {
        // Validate required fields
        if (!otp  || !id) {
            return res.status(400).json({
                status: 400,
                error: true,
                message: 'OTP and user ID are required',
                data: {
                    code: 'INVALID_CREDENTIALS',
                    details: 'Missing required fields'
                }
            });
        }

        // Validate OTP format (6 digits)
        const otpRegex = /^\d{6}$/;
        if (!otpRegex.test(otp)) {
            return res.status(400).json({
                status: 400,
                error: true,
                message: 'Invalid OTP format',
                data: {
                    code: 'INVALID_OTP',
                    details: 'OTP must be 6 digits'
                }
            });
        }

  

        
        const user = await User.findOne({
          where: {
            userId: id,
            otp: otp
          }
        });

     
        
        // Check if user exists and OTP matches
        if (!user) {
          return res.status(401).json({
              status: 401,
              error: true,
              message: 'Invalid OTP or user',
              data: {
                  code: 'INVALID_OTP',
                  details: 'The OTP you entered is incorrect or expired'
              }
          });
      }

  
        

        const jwtExpiry = process.env.JWT_EXPIRY ; // Fallback to 1h if not set
   
        
        const token = jwt.sign(
          {
            id: id,
            username: user.userName,
         
         
          },
          process.env.JWT_SECRET,
          { expiresIn: jwtExpiry }
        );
        

        console.log("in verify token  the req.user ",token,user.storeId);
       
        return res.status(200).json({
            status: 200,
            error: false,
            message: 'OTP verified successfully',
            data: {
                token: token ,// Include if using JWT 
                user: {
                    id: id,
                    username: user.userName,
                 
                },
              
            }
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



export const resendotp = async (req, res) => {
  const {  id, mobileNumber } = req.body;

  try {
    const user = await User.findOne({ 
      where: { mobileNumber: mobileNumber } 
    });
    
  
    if (!user) {
      console.log("User not found");
      return res.status(200).json({
        status: 200,
        error: false,
        message: "User does not exist",
        // data: { customerType: "New" },
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    await user.update({ otp });

     const formattedPhone = mobileNumber.replace(/\D/g, "").slice(-10);
     if (formattedPhone.length !== 10) {
       return res.status(400).json({
         status: 400,
         error: true,
         message: "Invalid phone number format",
         data: {
           code: "INVALID_PHONE",
           details: "Phone number must have 10 digits after removing country code",
         },
       });
     }
const smsData = {
  From: process.env.SMS_FROM_NAME,
  To: formattedPhone,
  TemplateName: "OTP_TO_CUSTOMER",
  VAR1: "User",
  VAR2: otp,
  VAR3: "LANGLEX",
};

const smsResponse = await axios.post(
  `https://2factor.in/API/V1/${process.env.SMS_API_KEY}/ADDON_SERVICES/SEND/TSMS`,
  smsData
);

console.log("📩 2Factor OTP Response:", smsResponse.data);

if (smsResponse.data.Status !== "Success") {
  return res.status(500).json({
    status: 500,
    error: true,
    message: "OTP sending failed",
    data: smsResponse.data,
  });
} 
   // ✅ Final success response
   return res.status(200).json({
      status: 200,
      error: false,
      message: " Resend OTP sent successfully",
      data: {
        user: {
          id: user.userId,
        }
      },
    });

  } catch (error) {
      console.error('Resend OTP verification error:', error);
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
