import Knowledge_p_categories from "../../../Models/knowledge_p_categories.js";
import Knowledge_s_categories from "../../../Models/knowledge_s_categories.js";
import Quiz_p_categories from "../../../Models/quiz_p_categories.js";
import Quiz_s_categories from "../../../Models/quiz_s_categories.js";
import Story_p_categories from "../../../Models/story_p_categories.js";
import Story_s_categories from "../../../Models/story_s_categories.js";





export const primaryCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const { category } = req.body;
      console.log("from ribin ",id ,"adn category",category);
      if (!category || category.length === 0) {
        return res.status(400).json({
          status: 400,
          error: true,
          message: 'No category provided',
          data: {
            code: 'BAD_REQUEST',
            details: 'The category field is missing or empty',
          },
        });
      }
  
      let primaryCategory = [];
  let Category_name=""
      if (category === 'quiz') {
        Category_name="quiz"
        primaryCategory = await Quiz_p_categories.findAll({
          where: { languageId: id }
        });
      } else if (category === 'story') {
        Category_name="story"
        primaryCategory = await Story_p_categories.findAll({
          where: { languageId: id }
        });
      } else if (category === 'knowledge') {
        Category_name="knowledge"
        primaryCategory = await Knowledge_p_categories.findAll({
          where: { languageId: id }
        });
      } else {
        return res.status(400).json({
          status: 400,
          error: true,
          message: 'Invalid category',
        });
      }

      if (!primaryCategory || primaryCategory.length === 0) {
        return res.status(400).json({
          status: 400,
          error: true,
          message: 'No category provided for the language',
          data: {
            code: 'BAD_REQUEST',
            details: 'The category is not found for this language',
          },
        });
      }
  
  
      return res.status(200).json({
        status: 200,
        error: false,
        message: `List of primary categories of ${Category_name} `,
        data: primaryCategory,
      });
  
    } catch (error) {
      console.error('Primary category fetch error:', error);
      return res.status(500).json({
        status: 500,
        error: true,
        message: 'Internal server error',
        data: {
          code: 'SERVER_ERROR',
          details: 'An error occurred while fetching primary categories',
        }
      });
    }
  };


  
export const  secondaryCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const { category,primaryCategoryId } = req.body;
      console.log("from ribin ",id ,"adn category",category);
      if (!category || category.length === 0) {
        return res.status(400).json({
          status: 400,
          error: true,
          message: 'No category provided',
          data: {
            code: 'BAD_REQUEST',
            details: 'The category field is missing or empty',
          },
        });
      }
  
      let secondaryCategory = [];
  let Category_name=""
      if (category === 'quiz') {
        Category_name="quiz"
        secondaryCategory = await Quiz_s_categories.findAll({
          where: { languageId: id , primaryCategoryId:primaryCategoryId}
        });
      } else if (category === 'story') {
        Category_name="story"
        secondaryCategory = await Story_s_categories.findAll({
          where: { languageId: id , primaryCategoryId:primaryCategoryId}
        });
      } else if (category === 'knowledge') {
        Category_name="knowledge"
        secondaryCategory = await Knowledge_s_categories.findAll({
          where: { languageId: id , primaryCategoryId:primaryCategoryId}
        });
      } else {
        return res.status(400).json({
          status: 400,
          error: true,
          message: 'Invalid category',
        });
      }

      if (!secondaryCategory || secondaryCategory.length === 0) {
        return res.status(400).json({
          status: 400,
          error: true,
          message: 'No secondary Category provided for the language',
          data: {
            code: 'BAD_REQUEST',
            details: 'The category is not found for this language',
          },
        });
      }
  
  
      return res.status(200).json({
        status: 200,
        error: false,
        message: `List of secondary categories of ${Category_name} `,
        data: secondaryCategory,
      });
  
    } catch (error) {
      console.error('Secondary category fetch error:', error);
      return res.status(500).json({
        status: 500,
        error: true,
        message: 'Internal server error',
        data: {
          code: 'SERVER_ERROR',
          details: 'An error occurred while fetching secondary categories',
        }
      });
    }
  };
  