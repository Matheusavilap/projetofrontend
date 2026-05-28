import { createIntl, createIntlCache } from 'react-intl';
import ptBR from './locales/pt-BR.json';
import enUS from './locales/en-US.json';

const cache = createIntlCache();

const messages = {
  'pt-BR': ptBR,
  'en-US': enUS
};

export const getIntl = (locale = 'pt-BR') => {
  return createIntl({
    locale,
    messages: messages[locale],
  }, cache);
};

export default {
  ptBR,
  enUS
};