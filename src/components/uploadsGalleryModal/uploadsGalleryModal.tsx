import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import {Text, View, FlatList, RefreshControl, TouchableOpacity, Alert, Platform } from 'react-native';
import FastImage from 'react-native-fast-image';
import { MainButton } from '..';
import { UploadedMedia } from '../../models';
import { addMyImage, getImages } from '../../providers/ecency/ecency';
import Modal from '../modal';
import styles from './uploadsGalleryModalStyles';
import { proxifyImageSrc } from '@ecency/render-helper';


export interface UploadsGalleryModalRef {
    showModal:()=>void;
}

interface MediaInsertData {
    url:string,
    hash:string,
}

interface UploadsGalleryModalProps {
    username:string;
    isUploading:boolean;
    handleOnSelect:(data:MediaInsertData)=>void;
    handleOnUploadPress:()=>void;
    uploadedImage:MediaInsertData;
}

export const UploadsGalleryModal =  forwardRef(({username, handleOnSelect, handleOnUploadPress, isUploading, uploadedImage}: UploadsGalleryModalProps, ref) => {
    const intl = useIntl();

    const [mediaUploads, setMediaUploads] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);   
  

    useImperativeHandle(ref, () => ({
        showModal: () => {
          setShowModal(true);
        },
      }));
      

    useEffect(() => {
        _getMediaUploads();
    }, []);

    useEffect(() => {
        if(uploadedImage){
            _addUploadedImageToGallery();
        }
    }, [uploadedImage])


    const _addUploadedImageToGallery = async () => {
        try{
            console.log("adding image to gallery",username, uploadedImage )
            setIsLoading(true);
            await addMyImage(username, uploadedImage.url);
            _getMediaUploads();
            setIsLoading(false);
        }catch(err){
            console.warn("Failed to get snippets", err)
            setIsLoading(false);
        }
    }


    //fetch snippets from server
    const _getMediaUploads = async () => {
        try{
            if (username) {
                setIsLoading(true);
                console.log("getting images for: " + username )
                const images = await getImages(username)
                console.log("images received", images)
                setMediaUploads(images);
                setIsLoading(false);
            }
        }catch(err){
            console.warn("Failed to get snippets")
            setIsLoading(false);
        }
    }



  //render list item for snippet and handle actions;
  const _renderItem = ({ item, index }:{item:UploadedMedia, index:number}) => {

    const _onPress = () => {
        
        const data = {
            url:item.url,
            hash:item.url.split('/').pop()
        }

        handleOnSelect(data)
        setShowModal(false);
    }

    const thumbUrl = proxifyImageSrc(item.url, 600, 500, Platform.OS === 'ios' ? 'match' : 'webp');

    return (
      <TouchableOpacity onPress={_onPress}>
        <FastImage 
            source={{uri:thumbUrl}}
            style={styles.mediaItem}
        />
      </TouchableOpacity>
    )
  };


    //render empty list placeholder
    const _renderEmptyContent = () => {
        return (
          <>
            <Text style={styles.title}>{intl.formatMessage({id:'uploads_modal.label_no_images'})}</Text>
          </>
        );
    };


    //renders footer with add snipept button and shows new snippet modal
    const _renderFloatingButton = () => {
        const _onPress = () => {
            if(handleOnUploadPress){
                handleOnUploadPress();
            }
            
        }
        return (
        <View style={styles.floatingContainer}>
            <MainButton
                style={{ width: isUploading?null:130}}
                onPress={_onPress}
                iconName="plus"
                iconType="MaterialCommunityIcons"
                iconColor="white"
                text={intl.formatMessage({id:'uploads_modal.btn_add'})}
                isLoading={isUploading}
            />
        </View>
        );
    };


    const _renderContent = (
        <View style={styles.container}>
            <View style={styles.bodyWrapper}>
            <FlatList
                data={mediaUploads}
                keyExtractor={(item) => `item_${item.url}`}
                renderItem={_renderItem}
                ListEmptyComponent={_renderEmptyContent}
                numColumns={3}
                refreshControl={
                    <RefreshControl 
                        refreshing={isLoading}
                        onRefresh={_getMediaUploads}
                    />
                }
            />
            {_renderFloatingButton()}
            </View>
        </View>
    )


  return (
    <Modal 
        isOpen={showModal}
        handleOnModalClose={() => setShowModal(false)}
        isFullScreen
        isCloseButton
        presentationStyle="formSheet"
        title={intl.formatMessage({
            id:'uploads_modal.title'
        })}
        animationType="slide"
        style={styles.modalStyle}
    >
    {_renderContent}
    </Modal>
     
  );
});


