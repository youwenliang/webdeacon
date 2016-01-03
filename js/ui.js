/* globals renderTags, processInputs, registerKeyboardHandlers */
'use strict';
document.body.classList.remove('hidden');

// init start
var titlebar = document.getElementById('titlebar');
var searchfield = document.getElementById('search');
var suggestionsSelect = document.getElementById('suggestions-select');
var suggestionTags = document.getElementById('suggestion-tags');
var tip = document.getElementById('tip');
var chatHistory = document.getElementById('chat-history');

renderTags(suggestionTags);
searchfield.addEventListener('input', processInputs);
searchfield.focus();

// click to reset input fields
titlebar.addEventListener('click', function() {
  searchfield.value = '';
  processInputs();
});
registerKeyboardHandlers();
// init end
