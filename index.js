'use strict';

/**
 * Selectors
 */
const sortSelect = document.querySelector('#sort-select');
const searchButton = document.querySelector('#search-button');
const sectionResults = document.querySelector('#results');
const selectSelect = document.querySelector('#select-select');
const typeSelect = document.querySelector('#type-select');
const zip = document.getElementById("zip");
const script = document.querySelector('#script');

/**
 * Distance methods
 */
const distance = (lat1, lon1, lat2, lon2) => {
  var R = 6371; // km
  var dLat = toRad(lat2 - lat1);
  var dLon = toRad(lon2 - lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

const toRad = (value) => {
  return value * Math.PI / 180;
}

/**
 * Sort
 */
const sortDistance = (array, increasing = true) => {
  return array.sort((a, b) => {
    let x = parseFloat(a['dist']);
    let y = parseFloat(b['dist']);
    if (increasing) {
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }
    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
  });
};

/**
 * Queries
 */
const queryResults = async () => {
  if(selectSelect.value)
  { 
    var sel_value = selectSelect.value;
    var str = `"${sel_value}"`;
    if(/^\d+$/.test(sel_value)) { str = `${sel_value}`; }
    var coords = alasql(`SELECT longitude, latitude FROM ? WHERE code_UAI = ${str}`, [data])[0];
    console.log(str);
    console.log(coords);
    if(coords){
      var str_where = "";
      if(typeSelect.value != "All"){ str_where = ` WHERE type = "${typeSelect.value}"`; }
      var all_etab = alasql(`SELECT * FROM ?${str_where}`, [data]);
      all_etab.forEach((x, i) => {
        all_etab[i].dist = distance(parseFloat(coords.latitude), parseFloat(coords.longitude), parseFloat(x.latitude), parseFloat(x.longitude)).toFixed(1);
      });
      all_etab = all_etab.filter(ele => { return ele.nom_ets != undefined; });
      sortDistance(all_etab, (sortSelect.value == 'asc'));
      if(sortSelect.value == 'asc'){
        renderResults(all_etab.slice(1, 101));
      } else {
        renderResults(all_etab.slice(0, 100));
      }
      
    } else {
      renderResults([]);
    }
  } else {
    renderResults([]);
  }
};

const querySelect = async () => {
  var zip_value = zip.value;
  if(!zip.value){ zip_value = "null"; }
  var res = alasql(`SELECT * FROM ? WHERE cp = ${zip_value}`, [data]);
  res = res.filter(ele => { return ele.nom_ets != undefined; });
  renderSelect(res);
};

/**
 * Renders
 */
const renderResults = (results) => {
  let json = JSON.stringify(results, null, '\t');
  script.innerHTML = json.slice(2, json.length-1);
  sectionResults.innerHTML = '<h2>Results</h2>';
  if (results.length != 0) {
    const fragment = document.createDocumentFragment();
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const template = results
      .map(result => {
        return `
      <tr id=${result._idid}>
        <td>${result.nom_ets}</th>
        <td>${result.adresse} (${result.cp})</td>
        <td>${result.dist} km</td>
      </tr>
    `;}).join('');
    tbody.innerHTML = template;
    thead.innerHTML = `
    <tr>
    <th width=50%>Name</th>
    <th width=40%>Adresse</th>
    <th width=10%>Distance</th>
    </tr>`
    table.appendChild(thead);
    table.appendChild(tbody);
    fragment.appendChild(table);
    sectionResults.appendChild(fragment);
  } else {
    const noresults = document.createElement('span');
    noresults.innerHTML = "No results !";
    sectionResults.appendChild(noresults);
  }
};

const renderSelect = async (values) => {
  const options = Array.from(
    values, x => `<option value="${x.code_UAI}">${x.nom_ets}</option>`
  ).join('');
  selectSelect.innerHTML = options;
};

/**
 * Listeners
 */
zip.addEventListener('change', event => {
  querySelect();
});

searchButton.addEventListener('click', event => {
  queryResults();
});