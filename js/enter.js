
let form = document.getElementById('create')
let newUser = false
let userID = 0
let userName = 0
let input = document.getElementById('start')


async function submitHandler(event) {
    event.preventDefault()

    const users = await fetchPosts()
    const userDatas = await Object.keys(users).map(key => {
      const user = users[key]
      user.id = key
      return user
    })
      
    const formData = {
      firstName: form.firstName.value.toUpperCase(),
      secondName: form.secondName.value.toUpperCase(),
      maxScore: 0,
      lastScore: 0,
      allScore: 0,
      date: new Date().toLocaleDateString()
    }

    for (let i=0; i < userDatas.length; i++) {
      
     if  ((userDatas[i].firstName == formData.firstName) && (userDatas[i].secondName == formData.secondName)) {
       newUser = true 
       userID = userDatas[i].id
       userName = userDatas[i].firstName
       userAllScore = userDatas[i].allScore
       userMaxScore = userDatas[i].maxScore
      }
    }

    if (!newUser) {
      let create = confirm(`Создать нового пользователя: ${formData.firstName} ${formData.secondName}?` )
      if (create) {
      console.log('создаем новую запись')
      await createPost(formData)
      } else {return}
    }
    else {
      localStorage.setItem('userID', userID)
      localStorage.setItem('userName', userName)
      localStorage.setItem('userAllScore', userAllScore)
      localStorage.setItem('userMaxScore', userMaxScore)
      localStorage.setItem('notFirstTime', 0)
      document.location.href="/welcome.html"
    }
  }

async function useRequest(request) {
    const response = await fetch(request)
    return await response.json()
  }


async function createPost(post) {    // сохраняем в базу данных запись
    try {
      const request = new Request('https://gmfi-080221-default-rtdb.firebaseio.com' + '/userData.json', {
        method: 'post',
        body: JSON.stringify(post)
      })
      return useRequest(request)
    } catch (error) {
      console.error(error)
    }
  }

  async function fetchPosts() {   // вытаскиваем из базы данных весь массив записей
    try {
      const request = new Request('https://gmfi-080221-default-rtdb.firebaseio.com' + '/userData.json', {
        method: 'get'
      })
      return useRequest(request)
    } catch (error) {
      console.error(error)
    }
  }


  

  
form.addEventListener('submit', submitHandler.bind(form))






