require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name                = "RNVolumeControl"
  s.version             = package['version']
  s.summary             = package['description']
  s.homepage            = "https://github.com/rtmalone/react-native-volume-control"
  s.license             = package['license']
  s.author              = package['author']

  s.platforms      = { :ios => "10.0"}
  s.source              = { :path => "file://../../react-native-volume-control" }
  s.preserve_paths      = "**/*.js"
  s.source_files   = 'RNVolumeControl/**/*.{h,m}'
  s.dependency "React"
  
end
