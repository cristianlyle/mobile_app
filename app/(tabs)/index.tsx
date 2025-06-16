import Button from "@/components/Button";
import CircleButton from "@/components/CircleButton";
import EmojiList from "@/components/EmojiList";
import EmojiPicker from "@/components/EmojiPicker";
import EmojiSticker from "@/components/EmojiSticker";
import IconButton from "@/components/IconButton";
import ImageViewer from "@/components/ImageViewer";
import domtoimage from "dom-to-image";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { captureRef } from "react-native-view-shot";


const PlaceholderImage = require("../../assets/images/background-image.png");

export default function Index() {

  const imageRef = useRef<View>(null);


  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pickedEmoji, setPickedEmoji] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (permissionResponse?.granted) {
      requestPermission();
    }

  },[]);

  const pickImageAsync = async () => {
     let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });
    
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      console.log(result);
    } else {
      console.log("Image picking was canceled");
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
  };

const onModalClose = () => {
  setIsModalVisible(false);
};
  const onAddSticker = () => {
    setIsModalVisible(true);

  };
  const onSaveImageAsync = async () => {
    if (Platform.OS !== 'web') {
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        });

        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          alert('Saved!');
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        //@ts-ignore
        const dataUrl = await domtoimage.toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        });

        let link = document.createElement('a');
        link.download = 'sticker-smash.jpeg';
        link.href = dataUrl;
        link.click();
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}> 
  <View ref = {imageRef} collapsable={false}  >
    <ImageViewer imgSource={selectedImage || PlaceholderImage} />
    {pickedEmoji && ( 
      <EmojiSticker imageSize={40} stickerSource={pickedEmoji}/> )}
         </View>
         {showAppOptions?(
          <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>
        </View>
        ):(
         <View style={styles.footerContainer}>
          <Button 
          onPress={pickImageAsync}
          label="Choose a Photo" theme="primary" />
          <Button 
          label="Edit Photo"  theme="secondary"
          onPress={() => setShowAppOptions(true)}
          />
          
         </View>
)}
          <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose}/>
          </EmojiPicker>
 </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgb(33, 52, 72)",
  },
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1, 
    alignItems: "center",
    justifyContent: "center", 
  },
  optionsContainer: {
   position: "absolute",
   bottom: 80,
  },
  optionsRow: {
    flexDirection: "row",
   alignItems: "center",
  },
});