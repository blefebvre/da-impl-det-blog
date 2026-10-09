import { readBlockConfig } from '../../scripts/aem.js';

function field(labelText, control) {
  const label = document.createElement('label');
  label.append(labelText, control);
  return label;
}

function hidden(name, value) {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = name;
  input.value = value;
  return input;
}

/**
 * Contact form posting to a form endpoint (e.g. Formspree).
 * Rows: Action (endpoint URL), Redirect (thank-you page), Subject, Submit (button label).
 */
export default function decorate(block) {
  const config = readBlockConfig(block);
  block.textContent = '';
  if (!config.action) return;

  const form = document.createElement('form');
  form.action = config.action;
  form.method = 'POST';

  const email = document.createElement('input');
  email.type = 'email';
  email.name = 'email';
  email.required = true;
  email.placeholder = 'Email Address';
  email.autocomplete = 'email';

  const content = document.createElement('textarea');
  content.name = 'content';
  content.rows = 5;
  content.required = true;
  content.placeholder = 'What would you like to say?';

  const gotcha = document.createElement('input');
  gotcha.type = 'text';
  gotcha.name = '_gotcha';
  gotcha.hidden = true;
  gotcha.tabIndex = -1;
  gotcha.autocomplete = 'off';

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'button primary';
  submit.textContent = config.submit || 'Say Hello';

  form.append(field('Email', email), field('Content', content), gotcha);
  if (config.redirect) form.append(hidden('_next', new URL(config.redirect, window.location).href));
  form.append(hidden('_subject', config.subject || 'New submission!'), submit);
  block.append(form);
}
