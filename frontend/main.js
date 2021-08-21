function getAllUsers() {
   return fetch("http://localhost:4000/graphql", {
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
}).then(res => res.json()).then(data => data.data.users);
}

async function appendUsers() {
    const tbody = document.getElementById("tableTbody")
    const users = await getAllUsers()
    for(let user of users) {
        tbody.innerHTML += `

        <tr>
        <th scope="row">${user.id}</th>
        <td>${user.name}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.address.street}</td>
        <td>${user.address.suite}</td>
        <td>${user.address.city}</td>
        <td>${user.address.zipcode}</td>
        <td>${user.address.geo.lat}</td>
        <td>${user.address.geo.lng}</td>
        <td class="deleteTd" data-userId="${user.id}"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg ms-3" viewBox="0 0 16 16">
            <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z"/>
          </svg>
        </td>
      </tr>
        
        `
    }
}

function deleteUsers() {

const deleteBtn = document.getElementsByClassName("deleteTd")

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
        })
    })
}
}

async function main() {
await appendUsers();
deleteUsers()
}
main()
