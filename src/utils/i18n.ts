export type Language = 'th' | 'en';

export interface Translations {
  appName: string;
  appSub: string;
  upload: string;
  uploadDesc: string;
  uploadPhoto: string;
  changePhoto: string;
  samplePhotos: string;
  exportBtn: string;
  exportTitle: string;
  exportSub: string;
  downloadImage: string;
  copyImage: string;
  copied: string;
  share: string;
  grid: string;
  reset: string;
  easyMode: string;
  proMode: string;
  easyModeDesc: string;
  
  // Tabs
  tabAlign: string;
  tabFrames: string;
  tabFilters: string;
  tabQuote: string;
  
  // Align / Realign
  zoom: string;
  rotate: string;
  pan: string;
  dragHint: string;
  mobileDragHint: string;
  centerBtn: string;
  fitInside: string;
  fillCover: string;
  flipH: string;
  flipV: string;
  resetPosition: string;
  arrowHelp: string;

  // Simple Mode Controls
  step1Photo: string;
  step1Desc: string;
  step2Move: string;
  step2Desc: string;
  step3Save: string;
  step3Desc: string;
  oneClickAutoFit: string;
  oneClickCenter: string;
  zoomBigger: string;
  zoomSmaller: string;
  rotateRight: string;
  
  // Frames
  selectFrame: string;
  mattingTitle: string;
  enableMatting: string;
  mattingSize: string;
  mattingColor: string;
  
  // Filters
  filterPreset: string;
  brightness: string;
  contrast: string;
  warmth: string;
  vignette: string;
  glassReflect: string;
  
  // Quote / Text
  quoteToggle: string;
  quoteToggleDesc: string;
  line1: string;
  line2: string;
  highlightWord: string;
  thaiCaption: string;
  highlightColor: string;
  presetQuotes: string;

  // Modal Export
  exportCropArea: string;
  fullWall: string;
  fullWallDesc: string;
  frameOnly: string;
  frameOnlyDesc: string;
  innerArt: string;
  innerArtDesc: string;
  resolution: string;
  resStandard: string;
  resHd: string;
  resPrint: string;
  fileFormat: string;
  generating: string;
  
  // Sample picker
  sampleTitle: string;
  sampleSub: string;
  loading: string;
}

export const translations: Record<Language, Translations> = {
  th: {
    appName: 'กรอบรูปหรู ReptileHiso',
    appSub: 'ใส่รูปในกรอบรูปหรู ปรับตำแหน่ง ซูม และดาวน์โหลดได้ง่ายๆ',
    upload: 'ใส่รูปภาพ',
    uploadDesc: 'เลือกรูปภาพจากเครื่องของคุณ',
    uploadPhoto: 'เลือกรูปของคุณ',
    changePhoto: 'เปลี่ยนรูปภาพ',
    samplePhotos: 'รูปตัวอย่าง',
    exportBtn: 'บันทึกรูป / โหลดรูป',
    exportTitle: 'บันทึกภาพกรอบรูปของคุณ',
    exportSub: 'ประมวลผลความละเอียดสูง บันทึกเก็บไว้หรือส่งต่อได้ทันที',
    downloadImage: 'ดาวน์โหลดรูปลงเครื่อง (Download)',
    copyImage: 'คัดลอกรูปภาพ (Copy)',
    copied: 'คัดลอกรูปแล้ว!',
    share: 'แชร์รูปภาพ',
    grid: 'เส้นตาราง',
    reset: 'คืนค่าเดิม',
    easyMode: 'โหมดง่าย (สำหรับคนทั่วไป)',
    proMode: 'โหมดละเอียด',
    easyModeDesc: 'ปุ่มใหญ่ ใช้งานง่าย ไม่ซับซ้อน เหมาะสำหรับมือถือและผู้ใหญ่',

    tabAlign: 'ปรับรูป',
    tabFrames: 'เลือกกรอบ',
    tabFilters: 'โทนสี',
    tabQuote: 'ข้อความ',

    zoom: 'ย่อ / ขยายภาพ (Zoom)',
    rotate: 'หมุนภาพ',
    pan: 'เลื่อนภาพ',
    dragHint: 'แตะหรือลากรูปบนภาพเพื่อเลื่อนตำแหน่ง',
    mobileDragHint: 'ใช้นิ้วลากที่รูปได้เลย หรือกดปุ่มด้านล่าง',
    centerBtn: 'จัดกึ่งกลาง',
    fitInside: 'พอดีกรอบ',
    fillCover: 'เต็มกรอบ',
    flipH: 'กลับซ้าย-ขวา',
    flipV: 'กลับบน-ล่าง',
    resetPosition: 'รีเซ็ตตำแหน่งรูป',
    arrowHelp: 'กดเลื่อนตำแหน่งรูปขึ้น ลง ซ้าย ขวา',

    step1Photo: '1. เลือกรูปภาพ',
    step1Desc: 'กดปุ่มเพื่อเลือกรูปจากมือถือหรือกล้อง',
    step2Move: '2. ปรับตำแหน่งรูปให้สวย',
    step2Desc: 'แตะลากที่รูป หรือกดปุ่มซูม/เลื่อน',
    step3Save: '3. บันทึกรูปเสร็จเรียบร้อย',
    step3Desc: 'กดบันทึกรูปลงเครื่องไปแชร์ได้ทันที',
    oneClickAutoFit: 'ปรับให้พอดีอัตโนมัติ',
    oneClickCenter: 'จัดตรงกลาง',
    zoomBigger: 'ขยายใหญ่ขึ้น (+)',
    zoomSmaller: 'ย่อเล็กลง (-)',
    rotateRight: 'หมุนรูป 90°',

    selectFrame: 'เลือกแบบกรอบรูป',
    mattingTitle: 'ขอบกระดาษรองรูป (Matting)',
    enableMatting: 'ใส่ขอบกระดาษรองด้านใน',
    mattingSize: 'ความหนาของขอบรอง',
    mattingColor: 'สีขอบรอง',

    filterPreset: 'ฟิลเตอร์โทนสี',
    brightness: 'ความสว่าง',
    contrast: 'ความคมชัด',
    warmth: 'โทนอุ่น / เย็น',
    vignette: 'เงาดำรอบขอบ',
    glassReflect: 'เงาสะท้อนกระจก',

    quoteToggle: 'แสดงข้อความบนผนัง',
    quoteToggleDesc: 'แสดงประโยคหรือข้อความความทรงจำข้างกรอบรูป',
    line1: 'ข้อความบรรทัดที่ 1',
    line2: 'ข้อความบรรทัดที่ 2',
    highlightWord: 'คำเน้นลายมือเขียน (Calligraphy)',
    thaiCaption: 'คำบรรยายภาษาไทย',
    highlightColor: 'สีตัวอักษรเน้น',
    presetQuotes: 'ข้อความแนะนำสำเร็จรูป',

    exportCropArea: 'เลือกขอบเขตที่จะบันทึก',
    fullWall: 'ภาพทั้งผนังห้อง',
    fullWallDesc: 'ได้ฉากและไฟส่องผนังแบบเต็ม',
    frameOnly: 'เฉพาะตัวกรอบรูป',
    frameOnlyDesc: 'ตัดขอบเฉพาะกรอบทอง',
    innerArt: 'เฉพาะรูปภาพด้านใน',
    innerArtDesc: 'ไม่มีขอบกรอบทอง',
    resolution: 'ขนาดความคมชัด',
    resStandard: 'ธรรมดา (ไวสุด)',
    resHd: 'คมชัดสูง 4K',
    resPrint: 'คมชัดพิเศษ สำหรับพิมพ์',
    fileFormat: 'ชนิดไฟล์ภาพ',
    generating: 'กำลังสร้างรูปภาพ...',

    sampleTitle: 'เลือกภาพตัวอย่างสำหรับทดลอง',
    sampleSub: 'ลองใส่ภาพตัวอย่างสวยๆ เพื่อดูมุมมองกรอบรูป',
    loading: 'กำลังโหลด...',
  },
  en: {
    appName: 'FrameCraft Studio',
    appSub: 'Sleek Picture Framing & Precision Realign Canvas',
    upload: 'Upload',
    uploadDesc: 'Upload image from computer',
    uploadPhoto: 'Choose Photo',
    changePhoto: 'Replace Photo',
    samplePhotos: 'Sample Photos',
    exportBtn: 'Export / Save',
    exportTitle: 'Export Your Framed Memory',
    exportSub: 'Rendered locally 100% on your device with high quality Canvas',
    downloadImage: 'Download Image File',
    copyImage: 'Copy Image',
    copied: 'Copied to Clipboard!',
    share: 'Share / Save',
    grid: 'Grid',
    reset: 'Reset',
    easyMode: 'Easy Mode (Simple)',
    proMode: 'Pro Mode',
    easyModeDesc: 'Large buttons, simplified controls, perfect for mobile & seniors',

    tabAlign: 'Align',
    tabFrames: 'Frames',
    tabFilters: 'Filters',
    tabQuote: 'Quote',

    zoom: 'Zoom / Scale',
    rotate: 'Rotate',
    pan: 'Pan Position',
    dragHint: 'Drag photo on canvas to reposition',
    mobileDragHint: 'Drag photo on canvas directly or use big buttons below',
    centerBtn: 'Center',
    fitInside: 'Fit Inside',
    fillCover: 'Fill Cover',
    flipH: 'Flip H',
    flipV: 'Flip V',
    resetPosition: 'Reset Alignment',
    arrowHelp: 'Nudge photo position Up, Down, Left, Right',

    step1Photo: '1. Select Photo',
    step1Desc: 'Tap to choose from phone or camera',
    step2Move: '2. Adjust & Position',
    step2Desc: 'Drag photo directly or use zoom buttons',
    step3Save: '3. Save & Download',
    step3Desc: 'Download your framed photo in one click',
    oneClickAutoFit: 'Auto Fit Cover',
    oneClickCenter: 'Center Photo',
    zoomBigger: 'Zoom In (+)',
    zoomSmaller: 'Zoom Out (-)',
    rotateRight: 'Rotate 90°',

    selectFrame: 'Select Frame Style',
    mattingTitle: 'Passé-Partout (Matting)',
    enableMatting: 'Enable Inner Matting',
    mattingSize: 'Matting Width',
    mattingColor: 'Matting Color',

    filterPreset: 'Color Filters',
    brightness: 'Brightness',
    contrast: 'Contrast',
    warmth: 'Warmth',
    vignette: 'Vignette',
    glassReflect: 'Glass Reflection',

    quoteToggle: 'Gallery Wall Typography',
    quoteToggleDesc: 'Displays elegant quotes & commemorative memory typography',
    line1: 'Headline Line 1',
    line2: 'Headline Line 2',
    highlightWord: 'Script Highlight Word',
    thaiCaption: 'Secondary Subtitle / Caption',
    highlightColor: 'Highlight Color',
    presetQuotes: 'Preset Quotes',

    exportCropArea: 'Export Crop Area',
    fullWall: 'Full Wall',
    fullWallDesc: 'Full Gallery Scene',
    frameOnly: 'Frame Only',
    frameOnlyDesc: 'Cropped Frame',
    innerArt: 'Inner Art',
    innerArtDesc: 'Photo Matting Only',
    resolution: 'Resolution Quality',
    resStandard: '1x Standard',
    resHd: '2x Ultra 4K',
    resPrint: '3x Print 300DPI',
    fileFormat: 'File Format',
    generating: 'Generating Canvas...',

    sampleTitle: 'Choose a Sample Photograph',
    sampleSub: 'Test framing & realign controls instantly',
    loading: 'Loading...',
  },
};
