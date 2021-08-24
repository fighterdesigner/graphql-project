const tbody = document.getElementById("tableTbody")
const deleteBtn = document.getElementsByClassName("deleteTd")
const submitBtn = document.getElementById("submit")

const name = document.querySelector('input[name="name"]')
const username = document.querySelector('input[name="username"]')
const email = document.querySelector('input[name="email"]')
const street = document.querySelector('input[name="street"]')
const suite = document.querySelector('input[name="suite"]')
const city = document.querySelector('input[name="city"]')
const zipcode = document.querySelector('input[name="zipcode"]')
const geolat = document.querySelector('input[name="geolat"]')
const geolng = document.querySelector('input[name="geolng"]')

async function getAllUsers() {
await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        query: `
        query{
            users{
              id
              name
              username
              email
              address {
                street
                suite
                city
                zipcode
                geo {
                  lat
                  lng
                }
              }
            }
          }
        `
    })
}).then(res => res.json()).then(data => {
  tbody.innerHTML = "";
  const users = data.data.users
  for(let i = 0; i < users.length; i++) {
    tbody.innerHTML += `

    <tr>
    <th scope="row">${i + 1}</th>
    <td>${users[i].name}</td>
    <td>${users[i].username}</td>
    <td>${users[i].email}</td>
    <td>${users[i].address.street}</td>
    <td>${users[i].address.suite}</td>
    <td>${users[i].address.city}</td>
    <td>${users[i].address.zipcode}</td>
    <td>${users[i].address.geo.lat}</td>
    <td>${users[i].address.geo.lng}</td>
    <td class="deleteTd" data-userId="${users[i].id}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg ms-3" viewBox="0 0 16 16">
        <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/>
      </svg>
    </td>
  </tr>
    
    `
}
});

}

function addUser() {
  fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      query: `
      mutation{
        addUser(
          name: "${name.value}",
          username: "${username.value}", 
          email:"${email.value}", 
          address:{
            street:"${street.value}", 
            suite:"${suite.value}",
            city:"${city.value}",
            zipcode:"${zipcode.value}",
            geo:{
              lat:"${geolat.value}", 
              lng:"${geolng.value}"
            }
          }
          ){
          name
        }
      }
      `
    })
  }).then(res => res.json()).then(data => {
    console.log('the user addes')
    main()
  })
}

submitBtn.addEventListener("click", () => {
  addUser()

  console.log("the user is added")
});


function deleteUser() {

for (let btn of deleteBtn) {
    btn.addEventListener('click', (e) => {
        const userid = btn.dataset.userid;
        fetch('http://localhost:4000/graphql', {
            method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        query: `
        mutation{
            deleteUser(id: ${userid}) {
              id
            }
          }
        `
    })
        }).then(res => res.json()).then(data => {
            console.log('user deleted');
            main()
        })
    })
}

}

async function main() {
  await getAllUsers()
  deleteUser()
}
main()
