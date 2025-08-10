// 照片数据
const photos = [
    {
        id: 1,
        src: './images/forest.jpg',
        title: '森林晨曦',
        description: '清晨的第一缕阳光穿过茂密的森林，唤醒沉睡的大地',
        audioType: 'forest',
        audioUrl: './audio/forest.mp3',
        audioDescription: '森林鸟鸣与微风声'
    },
    {
        id: 2,
        src: './images/snow.jpg',
        title: '雪山静谧',
        description: '皑皑白雪覆盖的山峰，在蓝天下静静伫立',
        audioType: 'snow',
        audioUrl: './audio/snow.mp3',
        audioDescription: '山风与雪花飘落声'
    },
    {
        id: 3,
        src: './images/ocean.jpg',
        title: '海浪轻抚',
        description: '温柔的海浪轻抚着金色的沙滩，带来大海的问候',
        audioType: 'ocean',
        audioUrl: './audio/ocean.mp3',
        audioDescription: '海浪拍打沙滩声'
    },
    {
        id: 4,
        src: './images/deer.jpg',
        title: '小鹿漫步',
        description: '活泼的小鹿在茂密的森林中快乐地奔跑',
        audioType: 'birds',
        audioUrl: './audio/birds.mp3',
        audioDescription: '鸟儿歌唱与草地微风'
    },
    {
        id: 5,
        src: './images/stream.jpg',
        title: '溪水潺潺',
        description: '清澈的溪水在石间欢快地流淌，奏响自然的乐章',
        audioType: 'stream',
        audioUrl: './audio/stream.mp3',
        audioDescription: '溪水流淌声'
    },
    {
        id: 6,
        src: './images/stars.jpg',
        title: '星空璀璨',
        description: '夜空中繁星点点，银河横跨天际，诉说着宇宙的奥秘',
        audioType: 'night',
        audioUrl: './audio/night.mp3',
        audioDescription: '夜晚蟋蟀与微风声'
    }
];

// 全局变量
let currentIndex = 0;
let audioContext = null;
let currentAudio = null;
let isPlaying = false;
let customAudios = {};

// Web Audio API 音频生成器
class NatureSoundGenerator {
    constructor() {
        this.audioContext = null;
        this.initAudioContext();
    }

    async initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
        }
    }

    generateForestSound(duration = 5) {
        if (!this.audioContext) return null;
        try {
            const bufferSize = this.audioContext.sampleRate * duration;
            const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
            
            for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
                const channelData = buffer.getChannelData(channel);
                for (let i = 0; i < bufferSize; i++) {
                    const time = i / this.audioContext.sampleRate;
                    
                    // 更真实的鸟鸣声 - 使用复杂的频率调制
                    let birdSound = 0;
                    if (time % 4 < 0.3) { // 鸟鸣间歇性出现
                        const chirpTime = (time % 4) / 0.3;
                        const freq1 = 1200 + 800 * Math.sin(chirpTime * 20) * Math.exp(-chirpTime * 8);
                        const freq2 = 800 + 400 * Math.sin(chirpTime * 15) * Math.exp(-chirpTime * 6);
                        birdSound = (Math.sin(2 * Math.PI * freq1 * time) * 0.15 + 
                                   Math.sin(2 * Math.PI * freq2 * time) * 0.1) * 
                                   Math.exp(-chirpTime * 5);
                    }
                    
                    // 另一种鸟鸣
                    if ((time + 1.5) % 5 < 0.4) {
                        const chirpTime = ((time + 1.5) % 5) / 0.4;
                        const freq = 1500 + 600 * Math.sin(chirpTime * 12) * Math.exp(-chirpTime * 4);
                        birdSound += Math.sin(2 * Math.PI * freq * time) * 0.08 * Math.exp(-chirpTime * 3);
                    }
                    
                    // 更真实的风声 - 使用粉红噪声
                    let windNoise = 0;
                    for (let j = 1; j <= 8; j++) {
                        windNoise += (Math.random() - 0.5) * (0.02 / j) * Math.sin(time * j * 0.5);
                    }
                    windNoise *= (1 + 0.3 * Math.sin(time * 0.1)); // 风力变化
                    
                    // 树叶沙沙声 - 高频噪声
                    const leaves = (Math.random() - 0.5) * 0.015 * 
                                  (1 + Math.sin(time * 3)) * 
                                  Math.sin(time * 25 + Math.sin(time * 5));
                    
                    // 远处的环境音 - 低频嗡嗡声
                    const ambient = Math.sin(2 * Math.PI * 40 * time) * 0.008 * 
                                   (1 + 0.2 * Math.sin(time * 0.05));
                    
                    channelData[i] = birdSound + windNoise + leaves + ambient;
                }
            }
            return buffer;
        } catch (error) {
            console.warn('Error generating forest sound:', error);
            return null;
        }
    }

    generateOceanSound(duration = 5) {
        if (!this.audioContext) return null;
        try {
            const bufferSize = this.audioContext.sampleRate * duration;
            const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
            
            for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
                const channelData = buffer.getChannelData(channel);
                for (let i = 0; i < bufferSize; i++) {
                    const time = i / this.audioContext.sampleRate;
                    
                    // 更真实的海浪声 - 多层次波浪
                    const wavePhase1 = Math.sin(2 * Math.PI * 0.06 * time);
                    const wavePhase2 = Math.sin(2 * Math.PI * 0.11 * time + 1.2);
                    const wavePhase3 = Math.sin(2 * Math.PI * 0.18 * time + 2.4);
                    
                    // 大浪声 - 低频深沉
                    const bigWave = wavePhase1 * 0.35 * (1 + 0.2 * Math.sin(time * 0.08));
                    
                    // 中等波浪
                    const mediumWave = wavePhase2 * 0.25 * (1 + 0.3 * Math.sin(time * 0.15));
                    
                    // 小波浪和泡沫
                    const smallWave = wavePhase3 * 0.18 * (1 + 0.4 * Math.sin(time * 0.25));
                    
                    // 海浪拍打沙滩的声音 - 周期性噪声爆发
                    let crashSound = 0;
                    const crashCycle = time % 6;
                    if (crashCycle < 1.5) {
                        const crashIntensity = Math.exp(-crashCycle * 2) * (1 - crashCycle / 1.5);
                        crashSound = (Math.random() - 0.5) * 0.3 * crashIntensity;
                    }
                    
                    // 泡沫声 - 高频嘶嘶声
                    let foamSound = 0;
                    for (let j = 1; j <= 6; j++) {
                        foamSound += (Math.random() - 0.5) * (0.015 / j) * 
                                   Math.sin(time * j * 8 + Math.sin(time * 0.3));
                    }
                    foamSound *= (1 + 0.5 * Math.sin(time * 0.2));
                    
                    // 海风声 - 连续的低频噪声
                    let seaWind = 0;
                    for (let j = 1; j <= 4; j++) {
                        seaWind += (Math.random() - 0.5) * (0.02 / j) * Math.sin(time * j * 0.3);
                    }
                    seaWind *= (1 + 0.3 * Math.sin(time * 0.07));
                    
                    channelData[i] = (bigWave + mediumWave + smallWave + crashSound + foamSound + seaWind) * 0.7;
                }
            }
            return buffer;
        } catch (error) {
            console.warn('Error generating ocean sound:', error);
            return null;
        }
    }

    generateStreamSound(duration = 5) {
        if (!this.audioContext) return null;
        try {
            const bufferSize = this.audioContext.sampleRate * duration;
            const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
            
            for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
                const channelData = buffer.getChannelData(channel);
                for (let i = 0; i < bufferSize; i++) {
                    const time = i / this.audioContext.sampleRate;
                    
                    // 更真实的流水声 - 连续的水流基调
                    let waterFlow = 0;
                    for (let j = 1; j <= 8; j++) {
                        const freq = 150 + j * 80;
                        waterFlow += Math.sin(2 * Math.PI * freq * time + Math.sin(time * j * 0.5)) * 
                                   (0.12 / j) * (1 + 0.3 * Math.sin(time * 0.2));
                    }
                    
                    // 水滴和飞溅声 - 随机的高频成分
                    let splashSound = 0;
                    if (Math.random() < 0.02) { // 偶尔的水滴声
                        const dropTime = time % 0.1;
                        splashSound = Math.sin(2 * Math.PI * (1000 + 500 * Math.random()) * time) * 
                                    0.08 * Math.exp(-dropTime * 30);
                    }
                    
                    // 气泡声 - 高频噪声
                    let bubbleSound = 0;
                    for (let j = 1; j <= 5; j++) {
                        bubbleSound += (Math.random() - 0.5) * (0.02 / j) * 
                                     Math.sin(time * j * 15 + Math.sin(time * 0.8));
                    }
                    bubbleSound *= (1 + 0.4 * Math.sin(time * 0.3));
                    
                    // 石头间湍流声 - 中频噪声
                    let rapidSound = 0;
                    for (let j = 1; j <= 4; j++) {
                        rapidSound += (Math.random() - 0.5) * (0.03 / j) * 
                                    Math.sin(time * j * 6 + Math.sin(time * 0.4));
                    }
                    rapidSound *= (1 + 0.2 * Math.sin(time * 0.15));
                    
                    // 远处的环境回音
                    const echo = waterFlow * 0.1 * Math.sin(time * 0.05);
                    
                    channelData[i] = (waterFlow + splashSound + bubbleSound + rapidSound + echo) * 0.8;
                }
            }
            return buffer;
        } catch (error) {
            console.warn('Error generating stream sound:', error);
            return null;
        }
    }

    generateSnowSound(duration = 5) {
        if (!this.audioContext) return null;
        try {
            const bufferSize = this.audioContext.sampleRate * duration;
            const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
            
            for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
                const channelData = buffer.getChannelData(channel);
                for (let i = 0; i < bufferSize; i++) {
                    const time = i / this.audioContext.sampleRate;
                    
                    // 更真实的雪花飘落声 - 极其微妙的高频噪声
                    let snowfallSound = 0;
                    for (let j = 1; j <= 12; j++) {
                        snowfallSound += (Math.random() - 0.5) * (0.003 / j) * 
                                       Math.sin(time * j * 2 + Math.sin(time * 0.02));
                    }
                    snowfallSound *= (1 + 0.2 * Math.sin(time * 0.01)); // 非常缓慢的变化
                    
                    // 山风声 - 低频持续的风声
                    let mountainWind = 0;
                    for (let j = 1; j <= 6; j++) {
                        mountainWind += Math.sin(2 * Math.PI * (40 + j * 15) * time + Math.sin(time * j * 0.1)) * 
                                      (0.015 / j) * (1 + 0.3 * Math.sin(time * 0.05));
                    }
                    
                    // 偶尔的雪花落在树枝上的声音
                    let branchSound = 0;
                    if (Math.random() < 0.005) { // 非常偶尔
                        const dropTime = time % 0.2;
                        branchSound = (Math.random() - 0.5) * 0.01 * Math.exp(-dropTime * 10);
                    }
                    
                    // 深度的寂静感 - 极低频的环境音
                    const deepSilence = Math.sin(2 * Math.PI * 15 * time) * 0.002 * 
                                      (1 + 0.1 * Math.sin(time * 0.003));
                    
                    // 远山回音
                    const echo = mountainWind * 0.05 * Math.sin(time * 0.008);
                    
                    channelData[i] = (snowfallSound + mountainWind + branchSound + deepSilence + echo) * 0.6;
                }
            }
            return buffer;
        } catch (error) {
            console.warn('Error generating snow sound:', error);
            return null;
        }
    }

    generateBirdsSound(duration = 5) {
        if (!this.audioContext) return null;
        try {
            const bufferSize = this.audioContext.sampleRate * duration;
            const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
            
            for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
                const channelData = buffer.getChannelData(channel);
                for (let i = 0; i < bufferSize; i++) {
                    const time = i / this.audioContext.sampleRate;
                    
                    // 多种鸟类鸣叫声
                    const robin = Math.sin(2 * Math.PI * (800 + 200 * Math.sin(time * 8)) * time) * 
                                 Math.exp(-((time % 2) - 1) * ((time % 2) - 1)) * 0.12;
                    const sparrow = Math.sin(2 * Math.PI * (1400 + 300 * Math.sin(time * 12)) * time) * 
                                   Math.exp(-((time % 1.2) - 0.6) * ((time % 1.2) - 0.6) * 3) * 0.08;
                    const finch = Math.sin(2 * Math.PI * (2200 + 400 * Math.sin(time * 15)) * time) * 
                                 Math.exp(-((time % 0.8) - 0.4) * ((time % 0.8) - 0.4) * 5) * 0.06;
                    
                    // 远处的鸟鸣
                    const distantBird = Math.sin(2 * Math.PI * (600 + 150 * Math.sin(time * 3)) * time) * 
                                       Math.exp(-((time % 4) - 2) * ((time % 4) - 2) / 2) * 0.04;
                    
                    // 草地环境声
                    const grassRustle = (Math.random() - 0.5) * 0.02 * Math.sin(time * 8);
                    const breeze = Math.sin(2 * Math.PI * 0.5 * time) * 0.03;
                    
                    channelData[i] = robin + sparrow + finch + distantBird + grassRustle + breeze;
                }
            }
            return buffer;
        } catch (error) {
            console.warn('Error generating birds sound:', error);
            return null;
        }
    }

    generateNightSound(duration = 5) {
        if (!this.audioContext) return null;
        try {
            const bufferSize = this.audioContext.sampleRate * duration;
            const buffer = this.audioContext.createBuffer(2, bufferSize, this.audioContext.sampleRate);
            
            for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
                const channelData = buffer.getChannelData(channel);
                for (let i = 0; i < bufferSize; i++) {
                    const time = i / this.audioContext.sampleRate;
                    
                    // 蟋蟀合唱
                    const cricket1 = Math.sin(2 * Math.PI * 4200 * time) * 
                                    (Math.sin(time * 25) > 0.7 ? 0.08 : 0) * Math.sin(time * 0.3);
                    const cricket2 = Math.sin(2 * Math.PI * 3800 * time) * 
                                    (Math.sin(time * 22 + 1) > 0.6 ? 0.06 : 0) * Math.sin(time * 0.4);
                    const cricket3 = Math.sin(2 * Math.PI * 4600 * time) * 
                                    (Math.sin(time * 28 + 2) > 0.8 ? 0.04 : 0) * Math.sin(time * 0.2);
                    
                    // 夜风声
                    const nightWind = (Math.random() - 0.5) * 0.025 * Math.sin(time * 0.6);
                    
                    // 远处猫头鹰叫声
                    const owl = Math.sin(2 * Math.PI * 180 * time) * 
                               Math.exp(-((time % 8) - 4) * ((time % 8) - 4) / 8) * 0.03;
                    
                    // 夜晚的神秘感
                    const mystical = Math.sin(2 * Math.PI * 80 * time) * 0.01 * Math.sin(time * 0.1);
                    
                    // 偶尔的树叶沙沙声
                    const leaves = (Math.random() - 0.5) * 0.015 * Math.exp(-((time % 6) - 3) * ((time % 6) - 3));
                    
                    channelData[i] = cricket1 + cricket2 + cricket3 + nightWind + owl + mystical + leaves;
                }
            }
            return buffer;
        } catch (error) {
            console.warn('Error generating night sound:', error);
            return null;
        }
    }

    playSound(type) {
        if (!this.audioContext) {
            console.warn('Audio context not available');
            return null;
        }
        
        // 确保音频上下文处于运行状态
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        try {
            let buffer;
            switch (type) {
                case 'forest': buffer = this.generateForestSound(); break;
                case 'ocean': buffer = this.generateOceanSound(); break;
                case 'stream': buffer = this.generateStreamSound(); break;
                case 'snow': buffer = this.generateSnowSound(); break;
                case 'birds': buffer = this.generateBirdsSound(); break;
                case 'night': buffer = this.generateNightSound(); break;
                default: buffer = this.generateForestSound();
            }
            
            if (!buffer) return null;
            
            const source = this.audioContext.createBufferSource();
            source.buffer = buffer;
            
            // 添加音量控制
            const gainNode = this.audioContext.createGain();
            gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
            
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            source.start();
            
            return source;
        } catch (error) {
            console.error('Error playing sound:', error);
            return null;
        }
    }
}

const soundGenerator = new NatureSoundGenerator();

// DOM 元素
const carousel = document.getElementById('carousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const playAudioBtn = document.getElementById('playAudioBtn');
const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
const uploadAudioBtn = document.getElementById('uploadAudioBtn');
const photoInput = document.getElementById('photoInput');
const audioInput = document.getElementById('audioInput');
const photoTitle = document.getElementById('photoTitle');
const photoDescription = document.getElementById('photoDescription');
const audioInfo = document.getElementById('audioInfo');
const audioNotification = document.getElementById('audioNotification');

function init() {
    createPhotoElements();
    updateCarousel();
    updatePhotoInfo();
    setupEventListeners();
}

function createPhotoElements() {
    carousel.innerHTML = '';
    photos.forEach((photo, index) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.innerHTML = `
            <img src="${photo.src}" alt="${photo.title}">
            <div class="photo-overlay">
                <h4>${photo.title}</h4>
                <p>${photo.description}</p>
            </div>
        `;
        photoItem.addEventListener('click', () => goToSlide(index));
        carousel.appendChild(photoItem);
    });
}

function updateCarousel() {
    const photoItems = carousel.querySelectorAll('.photo-item');
    const radius = 400;
    
    photoItems.forEach((item, index) => {
        const angle = ((index - currentIndex) * 60) * (Math.PI / 180);
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius - radius;
        const rotateY = -angle * (180 / Math.PI);
        
        item.style.transform = `
            translate(-50%, -50%) 
            translateX(${x}px) 
            translateZ(${z}px) 
            rotateY(${rotateY}deg)
            ${index === currentIndex ? 'scale(1.1)' : 'scale(0.8)'}
        `;
        
        item.classList.toggle('active', index === currentIndex);
        const distance = Math.abs(index - currentIndex);
        item.style.opacity = distance === 0 ? 1 : Math.max(0.3, 1 - distance * 0.2);
        item.style.zIndex = index === currentIndex ? 10 : 5 - distance;
    });
}

function updatePhotoInfo() {
    const currentPhoto = photos[currentIndex];
    photoTitle.textContent = currentPhoto.title;
    photoDescription.textContent = currentPhoto.description;
    
    if (customAudios[currentPhoto.id]) {
        audioInfo.textContent = '🎵 自定义音频已上传';
    } else {
        // 检查是否有真实音频文件
        checkAudioFileExists(currentPhoto.audioUrl).then(exists => {
            if (exists) {
                audioInfo.textContent = `🌿 真实自然音效: ${currentPhoto.audioDescription}`;
            } else {
                audioInfo.textContent = `🎶 合成音效: ${currentPhoto.audioDescription}`;
            }
        });
    }
}

// 检查音频文件是否存在
async function checkAudioFileExists(audioUrl) {
    if (!audioUrl) return false;
    
    try {
        const response = await fetch(audioUrl, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        return false;
    }
}

function goToSlide(index) {
    if (index === currentIndex) {
        playCurrentAudio();
        return;
    }
    currentIndex = index;
    updateCarousel();
    updatePhotoInfo();
    setTimeout(() => playCurrentAudio(), 800);
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % photos.length;
    updateCarousel();
    updatePhotoInfo();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    updateCarousel();
    updatePhotoInfo();
}

function playCurrentAudio() {
    const currentPhoto = photos[currentIndex];
    console.log('Playing audio for photo:', currentPhoto.title, 'Audio URL:', currentPhoto.audioUrl);
    
    stopCurrentAudio();
    showAudioNotification();
    
    const activePhoto = carousel.querySelector('.photo-item.active');
    if (activePhoto) activePhoto.classList.add('playing');
    
    try {
        if (customAudios[currentPhoto.id]) {
            // 使用用户上传的音频
            console.log('Using custom audio for photo:', currentPhoto.title);
            currentAudio = new Audio(customAudios[currentPhoto.id]);
            currentAudio.volume = 0.5;
            currentAudio.play().catch(e => {
                console.warn('Custom audio play failed:', e);
                // 如果用户音频失败，尝试使用默认音频
                playDefaultAudio(currentPhoto, activePhoto);
            });
            currentAudio.onended = () => {
                hideAudioNotification();
                if (activePhoto) activePhoto.classList.remove('playing');
                isPlaying = false;
            };
            currentAudio.onerror = () => {
                console.error('Custom audio error occurred');
                // 如果用户音频出错，尝试使用默认音频
                playDefaultAudio(currentPhoto, activePhoto);
            };
        } else {
            // 使用真实的自然音频文件
            console.log('Using default audio for photo:', currentPhoto.title);
            playDefaultAudio(currentPhoto, activePhoto);
        }
        isPlaying = true;
    } catch (error) {
        console.error('Error in playCurrentAudio:', error);
        hideAudioNotification();
        if (activePhoto) activePhoto.classList.remove('playing');
        isPlaying = false;
    }
}

function playDefaultAudio(photo, activePhoto) {
    console.log('playDefaultAudio called for:', photo.title, 'with audioUrl:', photo.audioUrl);
    
    // 首先尝试使用真实的音频文件
    if (photo.audioUrl) {
        console.log('Attempting to play real audio file:', photo.audioUrl);
        currentAudio = new Audio(photo.audioUrl);
        currentAudio.volume = 0.6;
        currentAudio.crossOrigin = "anonymous"; // 处理跨域问题
        
        currentAudio.play().then(() => {
            console.log('Successfully playing real audio:', photo.audioUrl);
        }).catch(e => {
            console.warn('Real audio file failed, using fallback:', e);
            // 如果真实音频文件无法播放，使用改进的合成音频作为后备
            playFallbackAudio(photo.audioType, activePhoto);
        });
        
        currentAudio.onended = () => {
            console.log('Audio ended for:', photo.title);
            hideAudioNotification();
            if (activePhoto) activePhoto.classList.remove('playing');
            isPlaying = false;
        };
        
        currentAudio.onerror = (e) => {
            console.warn('Real audio file error, using fallback:', e);
            // 如果真实音频文件出错，使用改进的合成音频作为后备
            playFallbackAudio(photo.audioType, activePhoto);
        };
    } else {
        console.log('No audioUrl found, using fallback audio for:', photo.title);
        // 如果没有真实音频文件URL，直接使用改进的合成音频
        playFallbackAudio(photo.audioType, activePhoto);
    }
}

function playFallbackAudio(audioType, activePhoto) {
    // 使用改进的合成音频作为后备方案
    currentAudio = soundGenerator.playSound(audioType);
    if (currentAudio) {
        setTimeout(() => {
            hideAudioNotification();
            if (activePhoto) activePhoto.classList.remove('playing');
            isPlaying = false;
        }, 8000); // 延长播放时间
    } else {
        hideAudioNotification();
        if (activePhoto) activePhoto.classList.remove('playing');
        isPlaying = false;
    }
}

function stopCurrentAudio() {
    try {
        if (currentAudio) {
            if (typeof currentAudio.stop === 'function') {
                currentAudio.stop();
            } else if (typeof currentAudio.pause === 'function') {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }
            currentAudio = null;
        }
        isPlaying = false;
        const playingPhoto = carousel.querySelector('.photo-item.playing');
        if (playingPhoto) playingPhoto.classList.remove('playing');
        hideAudioNotification();
    } catch (error) {
        console.warn('Error stopping audio:', error);
        currentAudio = null;
        isPlaying = false;
    }
}

function showAudioNotification() {
    audioNotification.classList.add('show');
}

function hideAudioNotification() {
    audioNotification.classList.remove('show');
}

function setupEventListeners() {
    // 添加错误处理
    try {
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (playAudioBtn) playAudioBtn.addEventListener('click', playCurrentAudio);
        
        if (uploadPhotoBtn) uploadPhotoBtn.addEventListener('click', () => photoInput.click());
        if (uploadAudioBtn) uploadAudioBtn.addEventListener('click', () => audioInput.click());
        
        if (photoInput) photoInput.addEventListener('change', handlePhotoUpload);
        if (audioInput) audioInput.addEventListener('change', handleAudioUpload);
        
        // 键盘导航
        document.addEventListener('keydown', (e) => {
            try {
                switch(e.key) {
                    case 'ArrowLeft': 
                        e.preventDefault();
                        prevSlide(); 
                        break;
                    case 'ArrowRight': 
                        e.preventDefault();
                        nextSlide(); 
                        break;
                    case ' ': 
                        e.preventDefault(); 
                        playCurrentAudio(); 
                        break;
                }
            } catch (error) {
                console.warn('Keyboard event error:', error);
            }
        });
        
        // 触摸支持
        let startX = 0;
        let startY = 0;
        
        if (carousel) {
            carousel.addEventListener('touchstart', (e) => {
                try {
                    startX = e.touches[0].clientX;
                    startY = e.touches[0].clientY;
                } catch (error) {
                    console.warn('Touch start error:', error);
                }
            }, { passive: true });
            
            carousel.addEventListener('touchend', (e) => {
                try {
                    const endX = e.changedTouches[0].clientX;
                    const endY = e.changedTouches[0].clientY;
                    const diffX = startX - endX;
                    const diffY = startY - endY;
                    
                    // 只有水平滑动距离大于垂直滑动距离时才触发切换
                    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                        if (diffX > 0) nextSlide();
                        else prevSlide();
                    }
                } catch (error) {
                    console.warn('Touch end error:', error);
                }
            }, { passive: true });
        }
        
        // 处理音频上下文用户激活
        document.addEventListener('click', () => {
            if (soundGenerator.audioContext && soundGenerator.audioContext.state === 'suspended') {
                soundGenerator.audioContext.resume();
            }
        }, { once: true });
        
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
}

function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            photos[currentIndex].src = e.target.result;
            createPhotoElements();
            updateCarousel();
        };
        reader.readAsDataURL(file);
    }
}

function handleAudioUpload(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('audio/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            customAudios[photos[currentIndex].id] = e.target.result;
            updatePhotoInfo();
        };
        reader.readAsDataURL(file);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', init);
