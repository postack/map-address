export function exportToCsv(places, filename) {
  
  var csvFile = 'Titulo,Esta en centro comercial,Direccion\n';
  csvFile += places.map(p => `${p.title.replace(/,/g, ' ')},${p.is_mall === '0'? 'No' : 'Si'},${p.address ? p.address.replace(/,/g, ' ') : ''}`).join('\n')
  var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    var link = document.createElement('a');
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}