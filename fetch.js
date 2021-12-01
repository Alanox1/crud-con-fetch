//Para que funcione, creo una API falsa local con JSON server y de ahi extraigo los Datos para hacer el crud

//Llamada a api y lectura de datos en pantalla
const d = document,
 $form = d.querySelector(".crud-form"),
  $title = d.querySelector(".crud-title"),
  $agregarBtn = d.querySelector(".agregar"),
   $agregarForm = d.querySelector(".agregar-usuario");
   let toggle = true;


//Lectura de datos y impresion de los mismos en el DOM
async function llenarTabla(){
    const $table = document.querySelector(".crud-table"),
    $template = document.getElementById("crud-template").content,
    $fragment = document.createDocumentFragment();
    try {
        //let respuesta = await fetch("https://jsonplaceholder.typicode.com/users"),
        
        let respuesta = await fetch("http://localhost:5558/users"), //Abro un server json con json-server y lo llamo
         json = await respuesta.json();

         if (!respuesta.ok) throw { status: respuesta.status, statusText: respuesta.statusText };

         json.forEach(el => {
             $template.querySelector(".name").textContent= el.name;
             $template.querySelector(".name").dataset.id = el.id;
             $template.querySelector(".email").textContent = el.email;
             $template.querySelector(".numero").textContent = el.phone;
             $template.querySelector(".direction").textContent = el.address.city;
             $template.querySelector(".edit").dataset.id = el.id
             $template.querySelector(".edit").dataset.name = el.name
             $template.querySelector(".edit").dataset.email = el.email
             $template.querySelector(".edit").dataset.numero = el.phone
             $template.querySelector(".edit").dataset.direction = el.address.city
             $template.querySelector(".delete").dataset.id = el.id
             let $clone = document.importNode($template, true);
             $fragment.appendChild($clone);                  
      });
      $table.querySelector("tbody").appendChild($fragment);    

    } catch (err) {
      let message = err.statusText || "Ocurrió un error";
        $table.insertAdjacentHTML("afterend",`<p><b>Error ${err.status} : ${message}</b></p>`)
    }
}
document.addEventListener("DOMContentLoaded",llenarTabla)







//Crear nuevos usuario y editar usuario (Metodos POST y PUT)

d.addEventListener("submit", async e => {
  if(e.target === $form) {
    e.preventDefault();
    if(!e.target.id.value) { //Si no existe el valor, hacemos una peticion POST
      try {
        let options = {
            method : "POST",
            headers : {
                "Content-type" : "application/json; charset=utf-8"
            },
            body: JSON.stringify({
              name : e.target.nombre.value,
              email : e.target.email.value,
              phone : e.target.numero.value,
              address : {
                city : e.target.direccion.value
              }
           }),
        },
          res = await fetch("http://localhost:5558/users",options)
      
          if(!res.ok) throw {status : res.status, statusText : res.statusText}

          location.reload()
    } 
    catch (error) {
      let message = err.statusText || "Ocurrió un error";
        $form.insertAdjacentHTML("afterend",`<p><b>Error ${err.status} : ${message}</b></p>`)
    }}
    else{//------ Y si no tiene un valor, hacemos un PUT - -----
      try {
        let options = {
          method: "PUT",
          headers: {
              "Content-type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
              name: e.target.nombre.value,
              email: e.target.email.value,
              phone : e.target.numero.value,
              address : {
                city : e.target.direccion.value
              }
          }),
      },
       res = await fetch(`http://localhost:5558/users/${e.target.id.value}`,options)

    if (!res.ok)
      throw { status: res.status, statusText: res.statusText };

    location.reload();
      } 
      catch (err) {
        let message = err.statusText || "Ocurrió un error";
        $form.insertAdjacentHTML(
          "afterend",
          `<p><b>Error ${err.status}: ${message}</b></p>`
      
         ) }
    }
  }
})




//Ejecutamos el ordenamiento  y desordenamiento de las tablas
document.addEventListener("click", async e=> {
  if(e.target.matches(".ordenar")) {
    ordenarTabla();
  }

  if(e.target.matches(".desordenar")){
    desordenarTabla();
  }


  if(e.target.matches(".edit")) {
    $title.textContent = "Editar Usuario";
    $form.nombre.value = e.target.dataset.name;
    $form.email.value = e.target.dataset.email;
    $form.numero.value = e.target.dataset.numero;
    $form.direccion.value = e.target.dataset.direction;
    $form.id.value = e.target.dataset.id
  }


  if(e.target.matches(".delete")) {
    let isDelete = confirm(`Estas seguro de eliminar el id: ${e.target.dataset.id}?`)

    if(isDelete){
            try {
            let options = {
                method : "DELETE",
                headers : {
                    "Content-type" : "application/json; charset=utf-8"
                },
            },
            res = await fetch(`http://localhost:5558/users/${e.target.dataset.id}`,options);
            if(!res.ok) throw {status : res.status, statusText : res.statusText}
            location.reload();
        } 
        catch (err) {
             alert(`Error ${err.statusText} : ${err.status}`);
        }}
        
    }
})






//Filtro de búsqueda
function filtrar() {
  // Declare variables
  let input = document.getElementById("myInput"),
    filter = input.value.toUpperCase(),
     table = document.querySelector(".crud-table"),
      tr = table.getElementsByTagName("tr"),
      td, i, txtValue;

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
       tr[i].style.display = "";
      } else {
       tr[i].style.display = "none";
      }}
  }
}
document.addEventListener("keyup",filtrar);





//Ordenar las tablas 
function ordenarTabla() {
  let rows,  i, x, y, shouldSwitch;
  let table = document.querySelector(".crud-table"),
  switching = true;
  while (switching) {
    switching = false;
    rows = table.rows;
    console.log(rows[1].getElementsByTagName("td")[0])
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
     
      x = rows[i].getElementsByTagName("td")[0];
      y = rows[i + 1].getElementsByTagName("td")[0];
      
      if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}


function desordenarTabla() {
  // location.reload()
  let  table = document.querySelector(".crud-table");
  table.querySelector("tbody").innerHTML = "";
  llenarTabla()
}




