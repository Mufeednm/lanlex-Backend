import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import archiver from 'archiver';
import uniqid from 'uniqid';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Quiz_contents from '../../Models/quiz_contents.js';
import Story_contents from '../../Models/story_contents.js';
import knowledge_contents from '../../Models/knowledge_contents.js';











// Fix for __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export const quizZip = async (req, res) => {
  try {
    const { primaryCategoryId, secondaryCategoryId, languageId } = req.body;

    console.log("hello");

    if (!primaryCategoryId || !secondaryCategoryId || !languageId) {
      console.warn('Missing required IDs');
      return res.status(400).json({ message: 'primaryCategoryId, secondaryCategoryId, and languageId are required' });
    }

    const contents = await Quiz_contents.findAll({
      where: { languageId, primaryCategoryId, secondaryCategoryId },
      raw: true
    });

    console.log(`Found ${contents.length} contents`);

    if (!contents || contents.length === 0) {
      console.warn('No quiz contents found');
      return res.status(404).json({ message: 'No quiz contents found' });
    }

    const folderName = `qp${primaryCategoryId}qs${secondaryCategoryId}`;
    const tempDir = path.join(__dirname, '../temp', folderName);
    await fs.ensureDir(tempDir);
    console.log('Created tempDir:', tempDir);

    const folders = [
      'questionAudio',
      'questionPicture',
      'option_1_audio',
      'option_2_audio',
      'option_3_audio',
      'option_4_audio'
    ];

    for (const folder of folders) {
      await fs.ensureDir(path.join(tempDir, folder));
    }

    for (const content of contents) {
      // Question Audio
      if (content.questionAudio) {
        const src = path.join(__dirname, '..', content.questionAudio);
        if (await fs.pathExists(src)) {
          const dest = path.join(tempDir, 'questionAudio', path.basename(src));
          await fs.copy(src, dest);
          content.questionAudio = `questionAudio/${path.basename(src)}`;
    
        } else {
          console.warn(`Question audio not found: ${src}`);
        }
      }

      // Question Picture
      if (content.questionPicture) {
        const src = path.join(__dirname, '..', content.questionPicture);
        if (await fs.pathExists(src)) {
          const dest = path.join(tempDir, 'questionPicture', path.basename(src));
          await fs.copy(src, dest);
          content.questionPicture = `questionPicture/${path.basename(src)}`;
          console.log('Copied questionPicture:', dest);
        } else {
          console.warn(`Question picture not found: ${src}`);
        }
      }

      // Option Audios
      for (let i = 1; i <= 4; i++) {
        const field = `option_${i}_audio`;
        if (content[field]) {
          const src = path.join(__dirname, '..', content[field]);
          if (await fs.pathExists(src)) {
            const dest = path.join(tempDir, `option_${i}_audio`, path.basename(src));
            await fs.copy(src, dest);
            content[field] = `option_${i}_audio/${path.basename(src)}`;
            console.log(`Copied ${field}:`, dest);
          } else {
            console.warn(`Option ${i} audio not found: ${src}`);
          }
        }
      }
    }

    const jsonPath = path.join(tempDir, 'contents.json');
    await fs.writeJson(jsonPath, contents, { spaces: 2 });
    console.log('Written contents.json');

    const zipName = `quiz_${secondaryCategoryId}.zip`;
    const zipPath = path.join(__dirname, '../temp', zipName);
    console.log('Zip will be created at:', zipPath);

    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', async () => {
      console.log(`Archive finalized. Size: ${archive.pointer()} bytes`);
      res.download(zipPath, zipName, async (err) => {
        if (err) {
          console.error('Download error:', err);
        } else {
          console.log('Download sent successfully');
        }
        await fs.remove(tempDir);
        await fs.remove(zipPath);
        console.log('Cleaned up temp files');
      });
    });

    output.on('error', (err) => {
      console.error('Stream error:', err);
    });

    archive.on('error', (err) => {
      console.error('Archiver error:', err);
      throw err;
    });

    archive.pipe(output);

    for (const folder of folders) {
      const folderPath = path.join(tempDir, folder);
      if (await fs.pathExists(folderPath)) {
        archive.directory(folderPath, `quiz1/${folder}`);
        console.log(`Added folder to archive: ${folder}`);
      }
    }

    archive.file(jsonPath, { name: 'quiz1/contents.json' });
    console.log('Added contents.json to archive');

    await archive.finalize();
    console.log('Archive finalize called');
  } catch (error) {
    console.error('ERROR IN quizZip:', error);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};








export const storyZip = async (req, res) => {
  try {
    const { primaryCategoryId, secondaryCategoryId, languageId } = req.body;

    if (!primaryCategoryId || !secondaryCategoryId || !languageId) {
      console.warn('Missing required IDs');
      return res.status(400).json({ message: 'primaryCategoryId, secondaryCategoryId, and languageId are required' });
    }

    const contents = await Story_contents.findAll({
      where: { languageId, primaryCategoryId, secondaryCategoryId },
      raw: true
    });

    if (!contents || contents.length === 0) {
      console.warn('No story contents found');
      return res.status(404).json({ message: 'No story contents found' });
    }

    const folderName = `sp${primaryCategoryId}ss${secondaryCategoryId}`;
    const tempDir = path.join(__dirname, '../temp', folderName);
    await fs.ensureDir(tempDir);
    console.log('Created tempDir:', tempDir);

    const folders = ['storyAudio', 'storyPicture'];

    for (const folder of folders) {
      await fs.ensureDir(path.join(tempDir, folder));
    }

    for (const content of contents) {
      // Copy story audio
      if (content.storyAudio) {
        const src = path.join(__dirname, '..', content.storyAudio);
        if (await fs.pathExists(src)) {
          const dest = path.join(tempDir, 'storyAudio', path.basename(src));
          await fs.copy(src, dest);
          content.storyAudio = `storyAudio/${path.basename(src)}`;
        } else {
          console.warn(`storyAudio not found: ${src}`);
        }
      }

      // Copy story picture
      if (content.storyPicture) {
        const src = path.join(__dirname, '..', content.storyPicture);
        if (await fs.pathExists(src)) {
          const dest = path.join(tempDir, 'storyPicture', path.basename(src));
          await fs.copy(src, dest);
          content.storyPicture = `storyPicture/${path.basename(src)}`;
          console.log('Copied storyPicture:', dest);
        } else {
          console.warn(`storyPicture not found: ${src}`);
        }
      }
    }

    // ✅ Write JSON after processing all contents
    const jsonPath = path.join(tempDir, 'contents.json');
    await fs.writeJson(jsonPath, contents, { spaces: 2 });
    console.log('Written contents.json');

    const zipName = `story${secondaryCategoryId}.zip`;
    const zipPath = path.join(__dirname, '../temp', zipName);
    console.log('Zip will be created at:', zipPath);

    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', async () => {
      console.log(`Archive finalized. Size: ${archive.pointer()} bytes`);
      res.download(zipPath, zipName, async (err) => {
        if (err) {
          console.error('Download error:', err);
        } else {
          console.log('Download sent successfully');
        }
        await fs.remove(tempDir);
        await fs.remove(zipPath);
        console.log('Cleaned up temp files');
      });
    });

    output.on('error', (err) => {
      console.error('Stream error:', err);
    });

    archive.on('error', (err) => {
      console.error('Archiver error:', err);
      throw err;
    });

    archive.pipe(output);

    for (const folder of folders) {
      const folderPath = path.join(tempDir, folder);
      if (await fs.pathExists(folderPath)) {
        archive.directory(folderPath, `${folderName}/${folder}`);
        console.log(`Added folder to archive: ${folder}`);
      }
    }

    archive.file(jsonPath, { name: `${folderName}/contents.json` });
    console.log('Added contents.json to archive');

    await archive.finalize();
    console.log('Archive finalize called');
  } catch (error) {
    console.error('ERROR IN storyZip:', error);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const knowledgeZip = async (req, res) => {
  try {
    const { primaryCategoryId, secondaryCategoryId, languageId } = req.body;

    if (!primaryCategoryId || !secondaryCategoryId || !languageId) {
      console.warn('Missing required IDs');
      return res.status(400).json({ message: 'primaryCategoryId, secondaryCategoryId, and languageId are required' });
    }

    const contents = await knowledge_contents.findAll({
      where: { languageId, primaryCategoryId, secondaryCategoryId },
      raw: true
    });

    if (!contents || contents.length === 0) {
      console.warn('No story contents found');
      return res.status(404).json({ message: 'No knowledge contents found' });
    }

    const folderName = `kp${primaryCategoryId}ks${secondaryCategoryId}`;
    const tempDir = path.join(__dirname, '../temp', folderName);
    await fs.ensureDir(tempDir);
    console.log('Created tempDir:', tempDir);

    const folders = ['contentImage', 'contentAudio','referenceAudio'];

    for (const folder of folders) {
      await fs.ensureDir(path.join(tempDir, folder));
    }

    for (const content of contents) {
      // Copy content audio
      if (content.contentAudio) {
        const src = path.join(__dirname, '..', content.contentAudio);
        if (await fs.pathExists(src)) {
          const dest = path.join(tempDir, 'contentAudio', path.basename(src));
          await fs.copy(src, dest);
          content.contentAudio = `contentAudio/${path.basename(src)}`;
        } else {
          console.warn(`contentAudio not found: ${src}`);
        }
      }
      // Copy referenceAudio audio
      if (content.referenceAudio) {
        const src = path.join(__dirname, '..', content.referenceAudio);
        if (await fs.pathExists(src)) {
          const dest = path.join(tempDir, 'referenceAudio', path.basename(src));
          await fs.copy(src, dest);
          content.referenceAudio = `referenceAudio/${path.basename(src)}`;
        } else {
          console.warn(`referenceAudio not found: ${src}`);
        }
      }

      // Copy contentImage
      if (content.contentImage) {
        const src = path.join(__dirname, '..', content.contentImage);
        if (await fs.pathExists(src)) {
          const dest = path.join(tempDir, 'contentImage', path.basename(src));
          await fs.copy(src, dest);
          content.contentImage = `contentImage/${path.basename(src)}`;
          console.log('Copied contentImage:', dest);
        } else {
          console.warn(`contentImage not found: ${src}`);
        }
      }
    }

    // ✅ Write JSON after processing all contents
    const jsonPath = path.join(tempDir, 'contents.json');
    await fs.writeJson(jsonPath, contents, { spaces: 2 });
    console.log('Written contents.json');

    const zipName = `knowledge${secondaryCategoryId}.zip`;
    const zipPath = path.join(__dirname, '../temp', zipName);
    console.log('Zip will be created at:', zipPath);

    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', async () => {
      console.log(`Archive finalized. Size: ${archive.pointer()} bytes`);
      res.download(zipPath, zipName, async (err) => {
        if (err) {
          console.error('Download error:', err);
        } else {
          console.log('Download sent successfully');
        }
        await fs.remove(tempDir);
        await fs.remove(zipPath);
        console.log('Cleaned up temp files');
      });
    });

    output.on('error', (err) => {
      console.error('Stream error:', err);
    });

    archive.on('error', (err) => {
      console.error('Archiver error:', err);
      throw err;
    });

    archive.pipe(output);

    for (const folder of folders) {
      const folderPath = path.join(tempDir, folder);
      if (await fs.pathExists(folderPath)) {
        archive.directory(folderPath, `${folderName}/${folder}`);
        console.log(`Added folder to archive: ${folder}`);
      }
    }

    archive.file(jsonPath, { name: `${folderName}/contents.json` });
    console.log('Added contents.json to archive');

    await archive.finalize();
    console.log('Archive finalize called');
  } catch (error) {
    console.error('ERROR IN storyZip:', error);
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};
























// Dummy DB function
// async function getContentsFromDB(primaryCategoryId, secondaryCategoryId, languageId) {
//     return [
//       {
//         contentId: 1,
//         contentMedia: 'uploads/media/sample1.jpg',
//         contentAudio: 'uploads/audio/sample1.mp3',
//         contentStatus: 'Approved',
//       },
//       {
//         contentId: 2,
//         contentMedia: 'uploads/media/sample2.jpg',
//         contentAudio: 'uploads/audio/sample2.mp3',
//         contentStatus: 'Approved',
//       },
//       {
//         contentId: 3,
//         contentMedia: 'uploads/media/sample3.jpg',
//         contentAudio: 'uploads/audio/sample3.mp3',
//         contentStatus: 'Approved',
//       },
  
//     ];
//   }
  

