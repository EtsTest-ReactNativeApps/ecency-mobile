import React, {useState} from 'react';
import { Dimensions } from 'react-native';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import WebView from 'react-native-webview';
import YoutubeIframe, { InitialPlayerParams } from 'react-native-youtube-iframe';

interface VideoPlayerSheetProps {
    youtubeVideoId?:string;
    videoUrl?:string;
    startTime?:number;
}

const VideoPlayerSheet = ({youtubeVideoId, videoUrl, startTime}: VideoPlayerSheetProps) => {

    const PLAYER_HEIGHT = Dimensions.get('screen').width * (9/16);

    const [shouldPlay, setShouldPlay] = useState(false);
    const [loading, setLoading] = useState(true);

    const _onReady = () => {
        setLoading(false)
        setShouldPlay(true);
    }

    const _onChangeState = (event:string) => {
        setShouldPlay(!(event == 'paused' || event == 'ended'));
    }

    const _onError = () => {
        setLoading(false)
    }

    const initialParams:InitialPlayerParams = {
        start:startTime
    }

    return (
        <View style={styles.container}>
            
            {youtubeVideoId && 
                <YoutubeIframe 
                    height={PLAYER_HEIGHT} 
                    videoId={youtubeVideoId} 
                    initialPlayerParams={initialParams}
                    onReady={_onReady} 
                    play={shouldPlay} 
                    onChangeState={_onChangeState} 
                    onError={_onError}
                />

            }{
                videoUrl && 
                    <View style={{height:PLAYER_HEIGHT}}>
                        <WebView 
                            scalesPageToFit={true}
                            bounces={false}
                            javaScriptEnabled={true}
                            automaticallyAdjustContentInsets={false}
                            onLoadEnd={()=>{
                                setLoading(false);
                            }}
                            onLoadStart={()=>{
                                setLoading(true);
                            }}
                            source={{uri:videoUrl}}
                        />
                    </View>
                   
            }
            {loading && <ActivityIndicator style={styles.activityIndicator}/>}
        </View>
  );
};

export default VideoPlayerSheet;

const styles = StyleSheet.create({
    container: {
        paddingVertical:16,
    },
    activityIndicator: {
        position:'absolute', alignItems:'center', justifyContent:'center', top:0, bottom:0, left:0, right:0}
});
