// Figma Variables 생성 플러그인
// 이 코드를 Figma 플러그인으로 실행하면 Local Variables가 생성됩니다.

const tokens = {
    colors: {
        "primary/100": { value: "#FAF5F0" },
        "primary/300": { value: "#8B8989" },
        "primary/500": { value: "#C4B29D" },
        "primary/600": { value: "#262421" },
        "primary/700": { value: "#1D1C1C" },
        "primary/900": { value: "#0F0E0E" },
        "status/error": { value: "#D8675C" },
        "status/errorBg": { value: "#3A1A17" },
        "status/success": { value: "#5DDB93" },
        "status/successBg": { value: "#173A26" },
        "chart/1": { value: "#EA580C" },
        "chart/2": { value: "#0D9488" },
        "chart/3": { value: "#1E3A5F" },
        "chart/4": { value: "#EAB308" },
        "chart/5": { value: "#F97316" },
        "semantic/background": { value: "#FFFFFF" },
        "semantic/foreground": { value: "#0A1628" },
        "semantic/border": { value: "#E2E8F0" },
        "semantic/muted": { value: "#F0F4F8" },
        "semantic/destructive": { value: "#EF4444" }
    },
    spacing: {
        "0": 0, "1": 4, "2": 8, "3": 12, "4": 16,
        "5": 20, "6": 24, "8": 32, "10": 40, "12": 48, "16": 64
    },
    borderRadius: {
        "none": 0, "sm": 4, "md": 6, "lg": 8, "xl": 12, "2xl": 16, "full": 9999
    },
    fontSizes: {
        "heading1": 48, "heading2": 36, "heading3": 28, "heading4": 24, "heading5": 20,
        "bodyLg": 18, "bodyMd": 16, "bodySm": 14, "caption": 12
    },
    lineHeights: {
        "heading1": 56, "heading2": 44, "heading3": 36, "heading4": 32, "heading5": 28,
        "bodyLg": 28, "bodyMd": 24, "bodySm": 20, "caption": 16
    },
    fontWeights: {
        "regular": 400, "medium": 500, "semibold": 600, "bold": 700
    }
};

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
    } : null;
}

async function createVariables() {
    // 1. Color Collection
    const colorCollection = figma.variables.createVariableCollection("Colors");
    for (const [name, data] of Object.entries(tokens.colors)) {
        const variable = figma.variables.createVariable(name, colorCollection, "COLOR");
        const rgb = hexToRgb(data.value);
        if (rgb) {
            variable.setValueForMode(colorCollection.defaultModeId, rgb);
        }
    }

    // 2. Spacing Collection
    const spacingCollection = figma.variables.createVariableCollection("Spacing");
    for (const [name, value] of Object.entries(tokens.spacing)) {
        const variable = figma.variables.createVariable(`spacing/${name}`, spacingCollection, "FLOAT");
        variable.setValueForMode(spacingCollection.defaultModeId, value);
    }

    // 3. Border Radius Collection
    const radiusCollection = figma.variables.createVariableCollection("Border Radius");
    for (const [name, value] of Object.entries(tokens.borderRadius)) {
        const variable = figma.variables.createVariable(`radius/${name}`, radiusCollection, "FLOAT");
        variable.setValueForMode(radiusCollection.defaultModeId, value);
    }

    // 4. Typography Collection
    const typographyCollection = figma.variables.createVariableCollection("Typography");

    for (const [name, value] of Object.entries(tokens.fontSizes)) {
        const variable = figma.variables.createVariable(`fontSize/${name}`, typographyCollection, "FLOAT");
        variable.setValueForMode(typographyCollection.defaultModeId, value);
    }

    for (const [name, value] of Object.entries(tokens.lineHeights)) {
        const variable = figma.variables.createVariable(`lineHeight/${name}`, typographyCollection, "FLOAT");
        variable.setValueForMode(typographyCollection.defaultModeId, value);
    }

    for (const [name, value] of Object.entries(tokens.fontWeights)) {
        const variable = figma.variables.createVariable(`fontWeight/${name}`, typographyCollection, "FLOAT");
        variable.setValueForMode(typographyCollection.defaultModeId, value);
    }

    figma.notify("✅ Variables 생성 완료! Local Variables 패널을 확인하세요.");
    figma.closePlugin();
}

createVariables();
