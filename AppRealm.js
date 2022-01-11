import React,{useState,useEffect} from 'react';
import {FlatList, Image, SafeAreaView,StyleSheet,Text, TouchableOpacity,View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import moment from 'moment';
import Realm from 'realm'
import AmazingCropper, { DefaultFooter } from 'react-native-amazing-cropper';


export default AppRealm =()=>{

    const [imageList,setImageList]=useState([])
    const [imageToEdit,setImageToEdit] = useState(null)
    const [indexToEdit,setIndexToEdit]=useState(null)
    const [realm,setRealm]=useState(null)

const realmFun = (image,date) =>{
    Realm.open({
      schema: [{name: 'images', properties: {image: 'string',date:'string'}}]
    }).then(realm => {
        try {
            realm.write(() => {
              realm.create('images', {image: image, date: date});
            });
          } catch (e) {
            console.log("Error on creation");
          }
      setRealm(realm);
      console.log("realm",realm);
  })
}
   console.log("info",realm? realm.objects('images'):"");

   const openCam = async()=>{
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
       realmFun(image.path,moment().format('LLLL'))
    });
  }


   const onDone = (croppedImageUri) => {
    let list = [...imageList]
    list[indexToEdit].image=croppedImageUri
    setImageList(list)
    setImageToEdit(null)
    setIndexToEdit(null)
  }

  const onCancel=()=>{
    setImageToEdit(null)
    setIndexToEdit(null)
  }

  const editPhoto = () =>{
    return(
      <AmazingCropper
        footerComponent={<DefaultFooter doneText='OK' rotateText='ROT' cancelText='BACK' />}
        onDone={onDone}
        onError={()=>{console.log("e")}}
        onCancel={onCancel}
        imageUri={imageToEdit}
        imageWidth={1600}
        imageHeight={2396}
      />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {imageToEdit?
      editPhoto()
    :
    <View>
      <TouchableOpacity style={{position:"absolute",right:10, padding:8}} onPress={openCam}>
      <Text style={{fontSize:20}} >+</Text>
      </TouchableOpacity>
      {imageList && imageList.length?
      <FlatList 
      style={{marginTop:30,paddingHorizontal:15}}
      data={imageList}
      renderItem={({item,index})=>{
        return(
          <TouchableOpacity activeOpacity={1} onPress={()=>{
            setImageToEdit(item.image)
            setIndexToEdit(index)
          }} style={styles.itemContainer}>
            <Image source={{uri:item.image}} style={styles.imageStyle} />
            <Text>{item.date}</Text>
          </TouchableOpacity>
        )
      }}
       />
       :
       <Text style={styles.textStyle}>no data available</Text>
      }
      </View>
}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  itemContainer:{
    flexDirection:"row",
    alignItems:"center",
    marginBottom:10
    },
    imageStyle:{
      width:50,
      height:50,
      borderRadius:25,
      marginRight:10
    },
    textStyle:{
      fontSize:14,
      textAlign:"center"
    }
})