//
//  ReactNativeVolumeController.m
//  ReactNativeVolumeController
//
//  Created by Tyler Malone on 03/18/19.
//  Copyright © 2019. All rights reserved.
//

#import "RNVolumeControl.h"

#import <AVFoundation/AVFoundation.h>
#import <MediaPlayer/MediaPlayer.h>

@implementation RNVolumeControl {
    MPVolumeView *volumeView;
    UISlider *volumeViewSlider;
    AVAudioSession *audioSession;
    bool hasListeners;
}

RCT_EXPORT_MODULE(VolumeControl)

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"VolumeChanged"];
}

- (instancetype)init{
    self = [super init];
    [self initAudioSessionObserver];
    return self;
}

- (void)startObserving {
    hasListeners = YES;
}

- (void)stopObserving {
    hasListeners = NO;
}

+ (BOOL) requiresMainQueueSetup {
    return YES;
}

- (void)initAudioSessionObserver{
    audioSession = [AVAudioSession sharedInstance];
    [audioSession addObserver:self forKeyPath:@"outputVolume" options:0 context:nil];
}



- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context{
    if ([keyPath isEqual:@"outputVolume"] && hasListeners) {
        if (@available(iOS 6.0, *)) {
            float newVolume = [[AVAudioSession sharedInstance] outputVolume];
            [self sendEventWithName:@"VolumeChanged" body:@{@"volume": [NSNumber numberWithFloat: newVolume]}];
        } else {
            // Fallback on earlier versions
        }
    }
}

- (void)dealloc {
    [audioSession removeObserver:self forKeyPath:@"outputVolume"];
}





@end
