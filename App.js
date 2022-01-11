import React,{useState,useEffect} from 'react';
import {FlatList, Image, SafeAreaView,StyleSheet,Text, TouchableOpacity,View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AmazingCropper, { DefaultFooter } from 'react-native-amazing-cropper';

export default App = () => {
  const [imageList,setImageList]=useState([])
  const [imageToEdit,setImageToEdit] = useState(null)
  const [indexToEdit,setIndexToEdit]=useState(null)

  useEffect(() => {
    getList()
  }, [])

  const getList = async () =>{
    try {     
      const value = await AsyncStorage.getItem('images_list');
      if (value!=null) {
        setImageList(JSON.parse(value))
      }
      }
      catch (error) {
      console.log(error)
      }
  }

  const openCam = async()=>{
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
       let imageInfo={image:image.path,date:moment().format('LLLL')}
       let list =[...imageList]
       list.push(imageInfo)
       setImageList(list)
       updateItem("images_list",imageInfo)

    });
  }
  
  const updateItem= async (key, value) => {
    try {
      const item = await AsyncStorage.getItem(key);
      let result =[]
      if (item!=null) {
         result = [...JSON.parse(item), value];
      }else{
         result.push(value)
      }
      await AsyncStorage.setItem(key, JSON.stringify(result));
    } catch (error) {console.log("error",error);}
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