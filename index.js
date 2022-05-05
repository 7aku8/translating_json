import fs from 'fs';
import { Config } from './config.js';
import 'dotenv/config';

import { processFile } from './helpers.js';
import { argv0 } from 'process';

(async () => {
    try {
        const targetLang = process.argv[2];

        if (!targetLang) {
            console.warn('Specify target language!');
            return process.exit(0);
        } else if (
            !Config.ALLOWED_TARGET_LANGS.includes(targetLang.toLowerCase())
        ) {
            console.warn('Not supported language!');
            return process.exit(0);
        }

        console.debug(`Start reading files from "${Config.INPUT_DIR}" directory...`);

        const files = fs.readdirSync(Config.INPUT_DIR);

        const filesToTranslate = files.filter(fileName => fileName.endsWith('.json'));

        if (!filesToTranslate.length) {
            console.warn("Files with proper extension haven't been found, exiting...");
            return process.exit(0);
        }

        console.info(`Found ${filesToTranslate.length} file(s), translating...`);

        for (const fileName of filesToTranslate) {
            console.info(`Processing file: ${fileName}`);

            const file = fs.readFileSync(`${Config.INPUT_DIR}/${fileName}`);
            const jsonString = file.toString();
            const parsedFile = JSON.parse(jsonString);

            const translation = await processFile({ jsonFile: parsedFile, targetLang });

            fs.writeFileSync(
                `${Config.OUTPUT_DIR}/${fileName}`,
                JSON.stringify(translation)
            );

            console.info(`File "${fileName}" processed successfully!`);
        }

        console.info('All files translated');
    } catch (e) {
        console.error('===========================');
        console.log(e);
        console.error('===========================');
    } finally {
        process.exit(0);
    }
})()