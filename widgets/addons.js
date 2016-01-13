/*globals localforage, defaultVerbStore */
'use strict';

var stoerKey = 'verbstore';
var configs = document.getElementById('configs');
var reset = document.getElementById('reset');
var tip = document.getElementById('tip');

localforage.getItem(stoerKey, function(err, value) {
  if (err) {
    console.error(err);
  } else {
    var verbAddons = JSON.parse(value);
    if (verbAddons) {
      verbAddons.forEach(function(verbAddon) {
        // <h3>open</h3>
        // <ul>
        //   <li>| name: orz | url: www.orz.org | embed: true | </li>
        // </ul>
        var header = document.createElement('h3');
        header.textContent = verbAddon.actionVerb;
        var ul = document.createElement('ul');
        configs.appendChild(header);
        configs.appendChild(ul);

        verbAddon.providers.forEach(function(provider) {
          var li = document.createElement('li');
          li.textContent = '| ';
          for (var prop in provider) {
            if(provider.hasOwnProperty(prop)) {
              li.textContent += prop + ': ' + provider[prop] + ' | ';
            }
          }
          ul.appendChild(li);
        });

        // enable user to add new app for open verb
        if (verbAddon.actionVerb === 'open') {
          // add new app
          var linkAdd = document.createElement('a');
          linkAdd.href = '#openform';
          linkAdd.textContent = 'Add new app';
          configs.appendChild(linkAdd);
          var formAdd = document.createElement('form');
          formAdd.id = 'openform';
          configs.appendChild(formAdd);
          linkAdd.addEventListener('click', function() {
            formAdd.innerHTML = '<label for="name">Name</label>' +
              '<input class="form-control" id="name">' +
              '<label for="url">URL</label>' +
              '<input class="form-control" id="url">' +
              '<select id="embed" class="form-control">' +
              '<option value="true" selected>True</option>' +
              '<option value="false">False</option>' +
              '</select>' +
              '<button id="addapp" class="btn btn-primary">Add App</button>';

            formAdd.addapp.addEventListener('click', function() {
              console.log(formAdd.name.value + ' | ' +
                formAdd.url.value + ' | ' +
                formAdd.embed.value);
              var isEmbed = formAdd.embed.value === 'true' ? true : false;
              addEntry(verbAddons, verbAddon, {
                name: formAdd.name.value,
                url: formAdd.url.value,
                embed: isEmbed
              });
            });
          });

          // remove app
          var linkRm = document.createElement('a');
          linkRm.href = '#removeApp';
          linkRm.textContent = 'Remove app';
          configs.appendChild(linkRm);
          var ulRm = document.createElement('ul');
          ulRm.id = 'removeApp';
          configs.appendChild(ulRm);
          linkRm.addEventListener('click', function() {
            verbAddon.providers.forEach(function(provider, idx) {
              var liRm = document.createElement('li');
              var aRm = document.createElement('a');
              aRm.type = idx;
              aRm.textContent = provider.name;
              aRm.addEventListener('click', function(evt) {
                removeEntry(verbAddons, verbAddon, evt.target);
              });
              liRm.appendChild(aRm);
              ulRm.appendChild(liRm);
            });
          });
        }
      });
    }
  }
});

reset.addEventListener('click', function() {
  localforage.setItem(stoerKey,
    JSON.stringify(defaultVerbStore)).then(function() {
      if (tip.classList.contains('hidden')) {
        tip.classList.remove('hidden');
      }
      tip.textContent = 'please reload the page';
    });
});

var addEntry = function(verbAddons, verbAddon, obj) {
  verbAddon.providers.push(obj);
  localforage.setItem(stoerKey, JSON.stringify(verbAddons))
  .then(function() {
    alert('App ' + obj.name +
      ' added, reload the page to access the new app');
  });
};

var removeEntry = function(verbAddons, verbAddon, element) {
  var idx = element.type;
  console.log('remove ' + idx);
  verbAddon.providers.splice(idx, 1);
  localforage.setItem(stoerKey, JSON.stringify(verbAddons))
  .then(function() {
    confirm('App ' + element.textContent +
      ' removed, reload the page to access the new app');
    window.location.reload();
  });
};
