import GlcWidgetImage from '../_widgets/image.vue';
import GlcWidgetText from '../_widgets/text.vue';
import GlcWidgetBonus from '../_widgets/bonus.vue';
import { $t } from '@/lang/i18n';

// 颜色
export const GLC_COLORS = {
  white: '#ffffff'
};

// 部件属性
export const GLC_FIELD = {
  imageSrc: 'imageSrc',
  size: 'size',
  position: 'position',
  color: 'color',
  fontSize: 'fontSize',
  letterSpacing: 'letterSpacing',
  fontFamily: 'fontFamily',
  fontBold: 'fontBold',
  fontItalic: 'fontItalic',
  text: 'text',
  textAlign: 'textAlign',
  textShadow: 'textShadow',
  boolean: 'boolean',
  otherStyle: 'otherStyle'
};

// 屏幕大小
export const WINDOW_OID = [
  { name: '1024*768', width: 1024, height: 768 },
  { name: '1366*768', width: 1366, height: 768 },
  { name: '1920*1080', width: 1920, height: 1080 },
  { name: '2560*1440', width: 2560, height: 1440 },
  { name: '3840*2160', width: 3840, height: 2160 }
];

// 字体
export const FONT_FAMILY = [
  { name: $t('components.gv_low_code.family_cast'), value: "CastFont, 'Microsoft YaHei', sans-serif" },
  { name: $t('components.gv_low_code.family_microsoft_ya_hei'), value: "'Microsoft YaHei', sans-serif" },
  { name: $t('components.gv_low_code.family_sans_serif'), value: 'Arial, Helvetica, sans-serif' },
  { name: $t('components.gv_low_code.family_serif'), value: "'Times New Roman', Times, serif" },
  { name: $t('components.gv_low_code.family_sim_sun'), value: 'SimSun, serif' },
  { name: $t('components.gv_low_code.family_kai_ti'), value: '"楷体", Kai, serif' }
];

// 部件信息
export const WIDGET_MAP = {
  image: {
    name: $t('components.gv_low_code.comp_image'),
    mark: 'image',
    attribute: [
      {
        name: $t('components.gv_low_code.attr_image'),
        field: GLC_FIELD.imageSrc,
        type: GLC_FIELD.imageSrc,
        def: '/images-extend/image-place.png'
      },
      {
        name: $t('components.gv_low_code.attr_size'),
        field: GLC_FIELD.size,
        type: GLC_FIELD.size,
        def: { width: 256, height: 256 }
      },
      { name: $t('components.gv_low_code.attr_position'), field: GLC_FIELD.position, type: GLC_FIELD.position }
    ]
  },
  text: {
    name: $t('components.gv_low_code.comp_text'),
    mark: 'text',
    attribute: [
      { name: $t('components.gv_low_code.attr_text'), field: GLC_FIELD.text, type: GLC_FIELD.text, def: '普通文字' },
      { name: $t('components.gv_low_code.attr_color'), field: GLC_FIELD.color, type: GLC_FIELD.color, def: '#04B1FB' },
      {
        name: $t('components.gv_low_code.attr_font_bold'),
        field: GLC_FIELD.fontBold,
        type: GLC_FIELD.fontBold,
        def: false
      },
      {
        name: $t('components.gv_low_code.attr_font_italic'),
        field: GLC_FIELD.fontItalic,
        type: GLC_FIELD.fontItalic,
        def: false
      },
      {
        name: $t('components.gv_low_code.attr_font_family'),
        field: GLC_FIELD.fontFamily,
        type: GLC_FIELD.fontFamily,
        def: FONT_FAMILY[0].value
      },
      {
        name: $t('components.gv_low_code.attr_font_size'),
        field: GLC_FIELD.fontSize,
        type: GLC_FIELD.fontSize,
        def: 14
      },
      {
        name: $t('components.gv_low_code.attr_text_space'),
        field: GLC_FIELD.letterSpacing,
        type: GLC_FIELD.fontSize,
        def: 2
      },
      {
        name: $t('components.gv_low_code.attr_text_align'),
        field: GLC_FIELD.textAlign,
        type: GLC_FIELD.textAlign,
        def: 'center'
      },
      {
        name: $t('components.gv_low_code.attr_text_shadow'),
        field: GLC_FIELD.textShadow,
        type: GLC_FIELD.textShadow,
        def: ''
      },
      {
        name: $t('components.gv_low_code.attr_size'),
        field: GLC_FIELD.size,
        type: GLC_FIELD.size,
        def: { width: 200, height: 50 }
      },
      { name: $t('components.gv_low_code.attr_position'), field: GLC_FIELD.position, type: GLC_FIELD.position },
      {
        name: $t('components.gv_low_code.attr_text_other'),
        field: GLC_FIELD.otherStyle,
        type: GLC_FIELD.otherStyle,
        def: ''
      }
    ]
  },
  bonus: {
    name: $t('components.gv_low_code.comp_bonus'),
    mark: 'bonus',
    attribute: [
      { name: $t('components.gv_low_code.attr_only_title'), field: 'onlyTitle', type: GLC_FIELD.boolean, def: false },
      { name: $t('components.gv_low_code.attr_color'), field: GLC_FIELD.color, type: GLC_FIELD.color, def: '#04B1FB' },
      {
        name: $t('components.gv_low_code.attr_font_bold'),
        field: GLC_FIELD.fontBold,
        type: GLC_FIELD.fontBold,
        def: false
      },
      {
        name: $t('components.gv_low_code.attr_font_italic'),
        field: GLC_FIELD.fontItalic,
        type: GLC_FIELD.fontItalic,
        def: false
      },
      {
        name: $t('components.gv_low_code.attr_font_family'),
        field: GLC_FIELD.fontFamily,
        type: GLC_FIELD.fontFamily,
        def: FONT_FAMILY[0].value
      },
      {
        name: $t('components.gv_low_code.attr_font_size'),
        field: GLC_FIELD.fontSize,
        type: GLC_FIELD.fontSize,
        def: 28
      },
      {
        name: $t('components.gv_low_code.attr_text_space'),
        field: GLC_FIELD.letterSpacing,
        type: GLC_FIELD.fontSize,
        def: 2
      },
      {
        name: $t('components.gv_low_code.attr_text_align'),
        field: GLC_FIELD.textAlign,
        type: GLC_FIELD.textAlign,
        def: 'center'
      },
      {
        name: $t('components.gv_low_code.attr_text_shadow'),
        field: GLC_FIELD.textShadow,
        type: GLC_FIELD.textShadow,
        def: ''
      },
      {
        name: $t('components.gv_low_code.attr_size'),
        field: GLC_FIELD.size,
        type: GLC_FIELD.size,
        def: { width: 200, height: 50 }
      },
      { name: $t('components.gv_low_code.attr_position'), field: GLC_FIELD.position, type: GLC_FIELD.position },
      {
        name: $t('components.gv_low_code.attr_text_other'),
        field: GLC_FIELD.otherStyle,
        type: GLC_FIELD.otherStyle,
        def: ''
      }
    ]
  }
};

// 根据mark获取组件
export const getWidgetComponent = (mark) => {
  if (mark === WIDGET_MAP.image.mark) {
    return GlcWidgetImage;
  } else if (mark === WIDGET_MAP.text.mark) {
    return GlcWidgetText;
  } else if (mark === WIDGET_MAP.bonus.mark) {
    return GlcWidgetBonus;
  }
};
