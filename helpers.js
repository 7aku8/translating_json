import { Translator as DeeplTranslator } from 'deepl-node';

const translator = new DeeplTranslator(process.env.DEEPL_API_KEY)

export const processFile = async ({ jsonFile, targetLang }) => {
    const translations = {};
    const entries = Object.entries(jsonFile);

    for (const [key, value] of entries) {
        console.debug(`Processing key: ${key}`);

        if (typeof value === "object") {
            translations[key] = await processFile({ jsonFile: value, targetLang });
        } else {
            const translation = value
                ? await translator.translateText(value, null, targetLang)
                : '';

            translations[key] = translation.text;
        }
    }

    return translations;
}