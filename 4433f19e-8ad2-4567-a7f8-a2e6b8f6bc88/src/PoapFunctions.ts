import { getUserData, UserData } from '@decentraland/Identity'
import { getParcel } from '@decentraland/ParcelIdentity'
import { poapText } from './PoapUIText'
import { CLEAR_UI, PoapBoothSystem } from './PoapBoothSystem'

var server = 'https://lkdcl.co/dcl/smartitems/'
var claimed = false
var base: any

export let userData: UserData
//export let playerRealm: Realm

export async function fetchUserData() {
  const data = await getUserData()
  return data
}

export async function setUserData() {
  const data = await getUserData()
  userData = data!
  var parcel = await getParcel()
  base = parcel.land.sceneJsonData.scene.base
}

/*
export async function setRealm() {
  let realm = await getCurrentRealm()
  log(`You are in the realm: ${JSON.stringify(realm?.displayName)}`)
  playerRealm = realm
}
*/

export async function handlePoap(eventName: string) {
  log(eventName)
  if (!userData) {
    await setUserData()
  }

  /*
  if (!playerRealm) {
    await setRealm()
  }
  */

  if (userData.hasConnectedWeb3) {
    let poap = await sendpoap(eventName)
    if (poap.success === true) {
      if (poap.dead) {
        showMessage('This event is no longer valid.', 5, CLEAR_UI, null)
      } else if (poap.already) {
        showMessage(
          'You already claimed a\nPOAP token for this event!',
          5,
          CLEAR_UI,
          null
        )
      } else {
        showMessage(
          "POAP was sent to your address!\nhttps/\/\:app.poap.xyz",
          5,
          CLEAR_UI,
          null
        )
      }
    } else {
      showMessage(poap.error, 5, CLEAR_UI, null)
    }
  } else {
    showMessage(
      'You need an in-browser Ethereum wallet\n(eg: Metamask) to claim this item.',
      5,
      CLEAR_UI,
      null
    )
  }
}

export function showMessage(
  message: string,
  time: number,
  action: string,
  entity: any
) {
  poapText.visible = true
  poapText.value = message
  engine.addSystem(new PoapBoothSystem(time, action, entity, null!))
}

export async function sendpoap(eventName: string) {
  if (!userData) {
    await setUserData()
  }
  /*
  if (!playerRealm) {
    await setRealm()
  }
  */

  const url = server + 'sendpoap'

  let body = JSON.stringify({
    address: userData.publicKey.toLowerCase(),
    event: eventName,
    item: 'POAP',
    //server: playerRealm.serverName,
    //realm: playerRealm.layer,
  })

  try {
    let response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    })
    let data = await response.json()
    log('Poap status: ', data)

    return data
  } catch {
    log('error fetching from token server ', url)
  }

  /*
  let testdata = {
          success:true,
          already:true,
          dead:true
  }
  return testdata
  */
}


export async function getPOAPImage(eventName:string) {
  
//const url = server + 'getpoapimage'

const url = 'https://api.poap.xyz/events'
try {
  var image:any
  let response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  let json = await response.json()
  for(var i = 0; i < json.length; i++){
    if(json[i].id == eventName){
      log("we have id")
      log(json[i].image_url)
      image = json[i].image_url
      break;
    }
  }
  if(image){
    return image
  }
  else{
    log('failure')
    return ""
  }

} catch {
 log('error fetching from POAP server', url)
}

let body = JSON.stringify({
  id: eventName
})

try {
  let response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body,
  })
  let data = await response.json()
  log('Poap status: ', data)

  return data.image
} catch {
  log('error fetching from token server ', url)
}
}
