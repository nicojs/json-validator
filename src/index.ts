import Ajv from 'ajv';

const schemaTextArea = document.getElementById('schema') as HTMLTextAreaElement;
const jsonTextArea = document.getElementById('json') as HTMLTextAreaElement;
const outputTextArea = document.getElementById('output') as HTMLTextAreaElement;
const validateButton = document.getElementById('validateBtn') as HTMLButtonElement;
const getLinkButton = document.getElementById('getLinkBtn') as HTMLButtonElement;
const linkInput = document.getElementById('linkInput') as HTMLInputElement;
const clipboardSuccessMessage = document.getElementById('copiedToClipboardMessage') as HTMLSpanElement;
const clipboardSuccessMessageFadeTimeSeconds = 1;

// Initialize "copied to clipboard" message
clipboardSuccessMessage.style.opacity = '1';
clipboardSuccessMessage.style.transition = `opacity ${clipboardSuccessMessageFadeTimeSeconds}s linear`;

function normalizeJson(maybeJson: string) {
  try {
    return JSON.stringify(JSON.parse(maybeJson));
  } catch {
    return maybeJson;
  }
}

function format(maybeJson: string) {
  try {
    return JSON.stringify(JSON.parse(maybeJson), null, 2);
  } catch {
    return maybeJson;
  }
}

function refreshUrl() {
  const schema = normalizeJson(schemaTextArea.value);
  const json = normalizeJson(jsonTextArea.value);
  history.pushState(null, null, `#?schema=${encodeURIComponent(schema)}&json=${encodeURIComponent(json)}`);
  linkInput.value = location.toString();
}

function validate() {
  refreshUrl();
  const schema = new Ajv({ allErrors: true, jsonPointers: true });
  try {
    schema.addSchema(JSON.parse(schemaTextArea.value), 'theSchema');
  } catch (error) {
    outputTextArea.value = `Error in schema!\n${error.toString()}`;
    return;
  }
  try {
    if (schema.validate('theSchema', JSON.parse(jsonTextArea.value))) {
      outputTextArea.value = '✅ JSON is valid!'
    } else {
      outputTextArea.value = schema.errors.map(error => `⚠ ${schema.errorsText([error])}`).join('\n');
    }
  } catch (error) {
    outputTextArea.value = `Error in JSON data!\n${error.toString()}`;
  }
}

document.execCommand('copy')

validateButton.addEventListener('click', validate);
getLinkButton.addEventListener('click', () => {
  refreshUrl();
  linkInput.select();
  document.execCommand('copy');
  clipboardSuccessMessage.hidden = false;

  setTimeout(() => clipboardSuccessMessage.style.opacity = '0');
  setTimeout(() => {
    clipboardSuccessMessage.hidden = true;
    clipboardSuccessMessage.style.opacity = '1';
  }, clipboardSuccessMessageFadeTimeSeconds * 1000);
});

const search = new URL(window.location.hash.substr(1), location.toString()).searchParams;
schemaTextArea.value = format(search.get('schema'));
jsonTextArea.value = format(search.get('json'));
refreshUrl();