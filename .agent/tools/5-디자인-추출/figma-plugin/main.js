// Neobank Design System - Complete Figma Plugin
// 실제 프로젝트 UI 스타일 기반으로 정확히 매칭

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
    } : { r: 0, g: 0, b: 0 };
}

// 시스템 폰트 → Figma 호환 폰트 매핑
function mapFontFamily(fontName) {
    var mappings = {
        "-apple-system": "Pretendard",
        "system-ui": "Pretendard",
        "BlinkMacSystemFont": "Pretendard",
        "Segoe UI": "Inter",
        "Helvetica Neue": "Inter",
        "Helvetica": "Inter",
        "Arial": "Inter",
        "sans-serif": "Inter",
        "Apple SD Gothic Neo": "Pretendard",
        "Noto Sans KR": "Pretendard",
        "Malgun Gothic": "Pretendard"
    };

    // 매핑 테이블에 있으면 변환
    if (mappings[fontName]) {
        return mappings[fontName];
    }

    // 쉼표로 구분된 폰트 스택에서 첫 번째 폰트 추출
    if (fontName && fontName.indexOf(",") > -1) {
        var firstFont = fontName.split(",")[0].trim().replace(/"/g, "").replace(/'/g, "");
        if (mappings[firstFont]) {
            return mappings[firstFont];
        }
        return firstFont;
    }

    return fontName || "Inter";
}

// 프로젝트 토큰 (tailwind.config.js 기반)
var tokens = {
    colors: {
        primary: {
            "100": "#FAF5F0",
            "300": "#8B8989",
            "500": "#C4B29D",
            "600": "#262421",
            "700": "#1D1C1C",
            "900": "#0F0E0E"
        },
        status: {
            "error": "#D8675C",
            "errorBg": "#3A1A17",
            "success": "#5DDB93",
            "successBg": "#173A26"
        }
    },
    // typo 클래스 정의 (tailwind.config.js에서 추출)
    typography: {
        "h1": { fontSize: 48, lineHeight: 56, fontWeight: 600 },
        "h1-ko": { fontSize: 44, lineHeight: 58, fontWeight: 600 },
        "h2": { fontSize: 32, lineHeight: 32, fontWeight: 600 },
        "h3": { fontSize: 26, lineHeight: 34, fontWeight: 600 },
        "h3-ko": { fontSize: 23, lineHeight: 33, fontWeight: 600 },
        "h4": { fontSize: 18, lineHeight: 26, fontWeight: 600 },
        "h4-ko": { fontSize: 18, lineHeight: 26, fontWeight: 500 },
        "b1": { fontSize: 16, lineHeight: 24, fontWeight: 500 },
        "b1-ko": { fontSize: 16, lineHeight: 24, fontWeight: 500 },
        "b2": { fontSize: 14, lineHeight: 20, fontWeight: 500 },
        "l1": { fontSize: 16, lineHeight: 16, fontWeight: 600 },
        "l1-ko": { fontSize: 16, lineHeight: 16, fontWeight: 600 },
        "l2": { fontSize: 14, lineHeight: 14, fontWeight: 600 },
        "l2-ko": { fontSize: 14, lineHeight: 14, fontWeight: 600 },
        "l3": { fontSize: 12, lineHeight: 12, fontWeight: 600 },
        "l3-ko": { fontSize: 12, lineHeight: 12, fontWeight: 600 },
        "c1": { fontSize: 14, lineHeight: 14, fontWeight: 700 },
        "c1-ko": { fontSize: 14, lineHeight: 14, fontWeight: 600 },
        "c2": { fontSize: 11, lineHeight: 15, fontWeight: 500 }
    },
    spacing: { "0": 0, "1": 4, "2": 8, "3": 12, "4": 16, "5": 20, "6": 24, "8": 32, "10": 40, "12": 48, "16": 64, "20": 80, "24": 96 },
    borderRadius: { "none": 0, "sm": 4, "md": 6, "lg": 8, "xl": 12, "2xl": 16, "full": 9999 },
    breakpoints: { "xs": 375, "sm": 768, "md": 1280, "lg": 1600 }
};

function createVariables() {
    try {
        // Colors
        var colorCollection = figma.variables.createVariableCollection("Neobank Colors");
        var keys = Object.keys(tokens.colors.primary);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            figma.variables.createVariable("primary/" + key, colorCollection, "COLOR")
                .setValueForMode(colorCollection.defaultModeId, hexToRgb(tokens.colors.primary[key]));
        }
        keys = Object.keys(tokens.colors.status);
        for (i = 0; i < keys.length; i++) {
            key = keys[i];
            figma.variables.createVariable("status/" + key, colorCollection, "COLOR")
                .setValueForMode(colorCollection.defaultModeId, hexToRgb(tokens.colors.status[key]));
        }

        // Spacing
        var spacingCollection = figma.variables.createVariableCollection("Neobank Spacing");
        keys = Object.keys(tokens.spacing);
        for (i = 0; i < keys.length; i++) {
            key = keys[i];
            figma.variables.createVariable("spacing/" + key, spacingCollection, "FLOAT")
                .setValueForMode(spacingCollection.defaultModeId, tokens.spacing[key]);
        }

        // Border Radius
        var radiusCollection = figma.variables.createVariableCollection("Neobank Radius");
        keys = Object.keys(tokens.borderRadius);
        for (i = 0; i < keys.length; i++) {
            key = keys[i];
            figma.variables.createVariable("radius/" + key, radiusCollection, "FLOAT")
                .setValueForMode(radiusCollection.defaultModeId, tokens.borderRadius[key]);
        }

        // Typography
        var typoCollection = figma.variables.createVariableCollection("Neobank Typography");
        figma.variables.createVariable("fontFamily/sans", typoCollection, "STRING")
            .setValueForMode(typoCollection.defaultModeId, "Manrope");
        figma.variables.createVariable("fontFamily/korean", typoCollection, "STRING")
            .setValueForMode(typoCollection.defaultModeId, "Pretendard");

        keys = Object.keys(tokens.typography);
        for (i = 0; i < keys.length; i++) {
            key = keys[i];
            var typo = tokens.typography[key];
            figma.variables.createVariable("typo/" + key + "/fontSize", typoCollection, "FLOAT")
                .setValueForMode(typoCollection.defaultModeId, typo.fontSize);
            figma.variables.createVariable("typo/" + key + "/lineHeight", typoCollection, "FLOAT")
                .setValueForMode(typoCollection.defaultModeId, typo.lineHeight);
            figma.variables.createVariable("typo/" + key + "/fontWeight", typoCollection, "FLOAT")
                .setValueForMode(typoCollection.defaultModeId, typo.fontWeight);
        }

        // Breakpoints
        var bpCollection = figma.variables.createVariableCollection("Neobank Breakpoints");
        keys = Object.keys(tokens.breakpoints);
        for (i = 0; i < keys.length; i++) {
            key = keys[i];
            figma.variables.createVariable("breakpoint/" + key, bpCollection, "FLOAT")
                .setValueForMode(bpCollection.defaultModeId, tokens.breakpoints[key]);
        }

        console.log("Variables 생성 완료");
        return true;
    } catch (err) {
        console.error("Variables 에러:", err);
        return false;
    }
}

function createTextStyles(font, hasPretendard) {
    var styleMap = {};
    var typoMap = tokens.typography;
    var keys = Object.keys(typoMap);

    for (var i = 0; i < keys.length; i++) {
        var name = keys[i];
        var typo = typoMap[name];

        // 폰트 스타일 결정
        var fontStyle = font.regular;
        if (typo.fontWeight === 500) fontStyle = font.medium;
        else if (typo.fontWeight === 600) fontStyle = font.semibold;
        else if (typo.fontWeight === 700) fontStyle = font.bold;

        // 한글 스타일은 Pretendard 사용 (로드된 경우만)
        var fontFamily = font.name;
        if (name.indexOf("-ko") !== -1 && hasPretendard) {
            fontFamily = "Pretendard";
        }

        try {
            var style = figma.createTextStyle();
            style.name = "typo-" + name;
            style.fontName = { family: fontFamily, style: fontStyle };
            style.fontSize = typo.fontSize;
            style.lineHeight = { value: typo.lineHeight, unit: "PIXELS" };
            styleMap[name] = style;
        } catch (err) {
            console.log("스타일 생성 실패 (스킵):", name, err.message);
        }
    }

    console.log("Text Styles 생성 완료:", Object.keys(styleMap).length + "개");
    return styleMap;
}

function loadFonts(originalFontName) {
    // 원본 폰트 먼저 시도
    var fontToTry = originalFontName || "Pretendard";

    // Pretendard Variable → Pretendard로 변환
    if (fontToTry.indexOf("Variable") >= 0) {
        fontToTry = fontToTry.replace(" Variable", "");
    }

    console.log("📝 원본 폰트 시도:", fontToTry);

    return figma.loadFontAsync({ family: fontToTry, style: "Regular" })
        .then(function () { return figma.loadFontAsync({ family: fontToTry, style: "Medium" }); })
        .then(function () { return figma.loadFontAsync({ family: fontToTry, style: "SemiBold" }); })
        .then(function () { return figma.loadFontAsync({ family: fontToTry, style: "Bold" }); })
        .then(function () {
            console.log("✅ 원본 폰트 로드 성공:", fontToTry);
            return { name: fontToTry, regular: "Regular", medium: "Medium", semibold: "SemiBold", bold: "Bold" };
        })
        .catch(function () {
            console.log("⚠️ " + fontToTry + " 실패, Manrope 시도");
            return figma.loadFontAsync({ family: "Manrope", style: "Regular" })
                .then(function () { return figma.loadFontAsync({ family: "Manrope", style: "Medium" }); })
                .then(function () { return figma.loadFontAsync({ family: "Manrope", style: "SemiBold" }); })
                .then(function () { return figma.loadFontAsync({ family: "Manrope", style: "Bold" }); })
                .then(function () {
                    figma.notify("⚠️ '" + fontToTry + "' 폰트 없음 - Manrope로 대체", { timeout: 5000 });
                    figma.ui.postMessage({
                        type: 'fontWarning',
                        originalFont: fontToTry,
                        fallbackFont: 'Manrope'
                    });
                    return { name: "Manrope", regular: "Regular", medium: "Medium", semibold: "SemiBold", bold: "Bold" };
                });
        })
        .catch(function () {
            console.log("⚠️ Manrope 실패, Inter(기본) 사용");
            return figma.loadFontAsync({ family: "Inter", style: "Regular" })
                .then(function () { return figma.loadFontAsync({ family: "Inter", style: "Medium" }); })
                .then(function () { return figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }); })
                .then(function () { return figma.loadFontAsync({ family: "Inter", style: "Bold" }); })
                .then(function () {
                    figma.notify("⚠️ '" + fontToTry + "' 폰트 없음 - Inter로 대체. 폰트 설치 후 다시 시도하세요.", { timeout: 8000 });
                    figma.ui.postMessage({
                        type: 'fontWarning',
                        originalFont: fontToTry,
                        fallbackFont: 'Inter',
                        downloadUrl: 'https://github.com/orioncactus/pretendard'
                    });
                    return { name: "Inter", regular: "Regular", medium: "Medium", semibold: "Semi Bold", bold: "Bold" };
                });
        });
}

function createComponents(font, styleMap, tokensData) {
    var yPos = 100, xPos = 100;
    // 전달받은 토큰 사용, 없으면 기본 토큰 사용
    var t = tokensData || tokens;
    var c = t.colors;

    // styleMap이 없으면 빈 객체 사용
    styleMap = styleMap || {};

    // components.json이 있으면 동적으로 생성
    if (t.components && t.components.length > 0) {
        console.log("동적 컴포넌트 생성:", t.components.length + "개");
        createDynamicComponents(t.components, c, font, styleMap, xPos, yPos);
        return true;
    }

    // components.json이 없으면 컴포넌트 생성 스킵
    console.log("components.json 없음 - 컴포넌트 생성 스킵");
    return false;

    /* 기본 컴포넌트 생성 비활성화 (아래 코드는 더 이상 실행되지 않음)
    
    // ============ BUTTONS (프로젝트 button.tsx 기반) ============
    // Button / Default / md - bg-primary-500, text-primary-900, typo-l3, h-10, px-6, rounded-[8px]
    var btnDefMd = figma.createComponent();
    btnDefMd.name = "Button / Default / md";
    btnDefMd.layoutMode = "HORIZONTAL";
    btnDefMd.primaryAxisAlignItems = "CENTER";
    btnDefMd.counterAxisAlignItems = "CENTER";
    btnDefMd.paddingLeft = 24; btnDefMd.paddingRight = 24;
    btnDefMd.resize(1, 40); btnDefMd.layoutSizingHorizontal = "HUG";
    btnDefMd.cornerRadius = 8;
    btnDefMd.fills = [{ type: "SOLID", color: hexToRgb(c.primary["500"]) }];
    var t1 = figma.createText();
    t1.fontName = { family: font.name, style: font.semibold };
    t1.characters = "Button";
    t1.fontSize = 12; t1.lineHeight = { value: 12, unit: "PIXELS" };
    t1.fills = [{ type: "SOLID", color: hexToRgb(c.primary["900"]) }];
    if (styleMap["l3"]) t1.textStyleId = styleMap["l3"].id;
    btnDefMd.appendChild(t1);
    btnDefMd.x = xPos; btnDefMd.y = yPos;
    
    // Button / Default / sm - h-8
    var btnDefSm = figma.createComponent();
    btnDefSm.name = "Button / Default / sm";
    btnDefSm.layoutMode = "HORIZONTAL";
    btnDefSm.primaryAxisAlignItems = "CENTER";
    btnDefSm.counterAxisAlignItems = "CENTER";
    btnDefSm.paddingLeft = 16; btnDefSm.paddingRight = 16;
    btnDefSm.resize(1, 32); btnDefSm.layoutSizingHorizontal = "HUG";
    btnDefSm.cornerRadius = 8;
    btnDefSm.fills = [{ type: "SOLID", color: hexToRgb(c.primary["500"]) }];
    var t2 = figma.createText();
    t2.fontName = { family: font.name, style: font.semibold };
    t2.characters = "Button";
    t2.fontSize = 12; t2.lineHeight = { value: 12, unit: "PIXELS" };
    t2.fills = [{ type: "SOLID", color: hexToRgb(c.primary["900"]) }];
    if (styleMap["l3"]) t2.textStyleId = styleMap["l3"].id;
    btnDefSm.appendChild(t2);
    btnDefSm.x = xPos + 120; btnDefSm.y = yPos;
    
    // Button / Default / lg - h-52px, typo-l2
    var btnDefLg = figma.createComponent();
    btnDefLg.name = "Button / Default / lg";
    btnDefLg.layoutMode = "HORIZONTAL";
    btnDefLg.primaryAxisAlignItems = "CENTER";
    btnDefLg.counterAxisAlignItems = "CENTER";
    btnDefLg.paddingLeft = 24; btnDefLg.paddingRight = 24;
    btnDefLg.resize(1, 52); btnDefLg.layoutSizingHorizontal = "HUG";
    btnDefLg.cornerRadius = 8;
    btnDefLg.fills = [{ type: "SOLID", color: hexToRgb(c.primary["500"]) }];
    var t3 = figma.createText();
    t3.fontName = { family: font.name, style: font.semibold };
    t3.characters = "Button";
    t3.fontSize = 14; t3.lineHeight = { value: 14, unit: "PIXELS" };
    t3.fills = [{ type: "SOLID", color: hexToRgb(c.primary["900"]) }];
    if (styleMap["l2"]) t3.textStyleId = styleMap["l2"].id;
    btnDefLg.appendChild(t3);
    btnDefLg.x = xPos + 220; btnDefLg.y = yPos;
    
    yPos += 70;
    
    // Button / Secondary / md - bg-primary-700, text-primary-100
    var btnSecMd = figma.createComponent();
    btnSecMd.name = "Button / Secondary / md";
    btnSecMd.layoutMode = "HORIZONTAL";
    btnSecMd.primaryAxisAlignItems = "CENTER";
    btnSecMd.counterAxisAlignItems = "CENTER";
    btnSecMd.paddingLeft = 24; btnSecMd.paddingRight = 24;
    btnSecMd.resize(1, 40); btnSecMd.layoutSizingHorizontal = "HUG";
    btnSecMd.cornerRadius = 8;
    btnSecMd.fills = [{ type: "SOLID", color: hexToRgb(c.primary["700"]) }];
    var t4 = figma.createText();
    t4.fontName = { family: font.name, style: font.semibold };
    t4.characters = "Button";
    t4.fontSize = 12; t4.lineHeight = { value: 12, unit: "PIXELS" };
    t4.fills = [{ type: "SOLID", color: hexToRgb(c.primary["100"]) }];
    if (styleMap["l3"]) t4.textStyleId = styleMap["l3"].id;
    btnSecMd.appendChild(t4);
    btnSecMd.x = xPos; btnSecMd.y = yPos;
    
    // Button / Disabled / md - bg-primary-300
    var btnDisMd = figma.createComponent();
    btnDisMd.name = "Button / Disabled / md";
    btnDisMd.layoutMode = "HORIZONTAL";
    btnDisMd.primaryAxisAlignItems = "CENTER";
    btnDisMd.counterAxisAlignItems = "CENTER";
    btnDisMd.paddingLeft = 24; btnDisMd.paddingRight = 24;
    btnDisMd.resize(1, 40); btnDisMd.layoutSizingHorizontal = "HUG";
    btnDisMd.cornerRadius = 8;
    btnDisMd.fills = [{ type: "SOLID", color: hexToRgb(c.primary["300"]) }];
    var t5 = figma.createText();
    t5.fontName = { family: font.name, style: font.semibold };
    t5.characters = "Button";
    t5.fontSize = 12; t5.lineHeight = { value: 12, unit: "PIXELS" };
    t5.fills = [{ type: "SOLID", color: hexToRgb(c.primary["900"]) }];
    if (styleMap["l3"]) t5.textStyleId = styleMap["l3"].id;
    btnDisMd.appendChild(t5);
    btnDisMd.x = xPos + 120; btnDisMd.y = yPos;
    
    yPos += 80;
    
    // ============ INPUTS (프로젝트 input.tsx 기반) ============
    // Input / Default - h-52px, bg-primary-700, border-primary-700, typo-b1, placeholder text-primary-300
    var inpDef = figma.createComponent();
    inpDef.name = "Input / Default";
    inpDef.layoutMode = "HORIZONTAL";
    inpDef.primaryAxisAlignItems = "CENTER";
    inpDef.paddingLeft = 16; inpDef.paddingRight = 16;
    inpDef.resize(320, 52);
    inpDef.cornerRadius = 8;
    inpDef.fills = [{ type: "SOLID", color: hexToRgb(c.primary["700"]) }];
    inpDef.strokes = [{ type: "SOLID", color: hexToRgb(c.primary["700"]) }];
    inpDef.strokeWeight = 1;
    var it1 = figma.createText();
    it1.fontName = { family: font.name, style: font.medium };
    it1.characters = "Placeholder";
    it1.fontSize = 16; it1.lineHeight = { value: 24, unit: "PIXELS" };
    it1.fills = [{ type: "SOLID", color: hexToRgb(c.primary["300"]) }];
    it1.layoutGrow = 1;
    inpDef.appendChild(it1);
    inpDef.x = xPos; inpDef.y = yPos;
    
    // Input / Focus - border-primary-300, text-primary-100
    var inpFocus = figma.createComponent();
    inpFocus.name = "Input / Focus";
    inpFocus.layoutMode = "HORIZONTAL";
    inpFocus.primaryAxisAlignItems = "CENTER";
    inpFocus.paddingLeft = 16; inpFocus.paddingRight = 16;
    inpFocus.resize(320, 52);
    inpFocus.cornerRadius = 8;
    inpFocus.fills = [{ type: "SOLID", color: hexToRgb(c.primary["700"]) }];
    inpFocus.strokes = [{ type: "SOLID", color: hexToRgb(c.primary["300"]) }];
    inpFocus.strokeWeight = 1;
    var it2 = figma.createText();
    it2.fontName = { family: font.name, style: font.medium };
    it2.characters = "Input text";
    it2.fontSize = 16; it2.lineHeight = { value: 24, unit: "PIXELS" };
    it2.fills = [{ type: "SOLID", color: hexToRgb(c.primary["100"]) }];
    it2.layoutGrow = 1;
    inpFocus.appendChild(it2);
    inpFocus.x = xPos; inpFocus.y = yPos + 70;
    
    // Input / Error - border-status-error
    var inpErr = figma.createComponent();
    inpErr.name = "Input / Error";
    inpErr.layoutMode = "HORIZONTAL";
    inpErr.primaryAxisAlignItems = "CENTER";
    inpErr.paddingLeft = 16; inpErr.paddingRight = 16;
    inpErr.resize(320, 52);
    inpErr.cornerRadius = 8;
    inpErr.fills = [{ type: "SOLID", color: hexToRgb(c.primary["700"]) }];
    inpErr.strokes = [{ type: "SOLID", color: hexToRgb(c.status["error"]) }];
    inpErr.strokeWeight = 1;
    var it3 = figma.createText();
    it3.fontName = { family: font.name, style: font.medium };
    it3.characters = "Invalid input";
    it3.fontSize = 16; it3.lineHeight = { value: 24, unit: "PIXELS" };
    it3.fills = [{ type: "SOLID", color: hexToRgb(c.primary["100"]) }];
    it3.layoutGrow = 1;
    inpErr.appendChild(it3);
    inpErr.x = xPos; inpErr.y = yPos + 140;
    
    yPos += 230;
    
    // ============ CARD (프로젝트 card.tsx 기반) ============
    // rounded-lg, p-6
    var card = figma.createComponent();
    card.name = "Card";
    card.layoutMode = "VERTICAL";
    card.paddingTop = 24; card.paddingBottom = 24;
    card.paddingLeft = 24; card.paddingRight = 24;
    card.itemSpacing = 6;
    card.resize(360, 1); card.layoutSizingVertical = "HUG";
    card.cornerRadius = 8;
    card.fills = [{ type: "SOLID", color: hexToRgb(c.primary["600"]) }];
    var cardTitle = figma.createText();
    cardTitle.fontName = { family: font.name, style: font.semibold };
    cardTitle.characters = "Card Title";
    cardTitle.fontSize = 24; cardTitle.lineHeight = { value: 32, unit: "PIXELS" };
    cardTitle.fills = [{ type: "SOLID", color: hexToRgb(c.primary["100"]) }];
    card.appendChild(cardTitle);
    var cardDesc = figma.createText();
    cardDesc.fontName = { family: font.name, style: font.regular };
    cardDesc.characters = "Card description text here.";
    cardDesc.fontSize = 14; cardDesc.lineHeight = { value: 20, unit: "PIXELS" };
    cardDesc.fills = [{ type: "SOLID", color: hexToRgb(c.primary["300"]) }];
    card.appendChild(cardDesc);
    card.x = xPos; card.y = yPos;
    
    yPos += 160;
    
    // ============ BADGES (프로젝트 badge.tsx 기반) ============
    // rounded-full, px-2.5, py-0.5, text-xs font-semibold
    var badgeDef = figma.createComponent();
    badgeDef.name = "Badge / Default";
    badgeDef.layoutMode = "HORIZONTAL";
    badgeDef.primaryAxisAlignItems = "CENTER";
    badgeDef.counterAxisAlignItems = "CENTER";
    badgeDef.paddingLeft = 10; badgeDef.paddingRight = 10;
    badgeDef.paddingTop = 2; badgeDef.paddingBottom = 2;
    badgeDef.cornerRadius = 9999;
    badgeDef.fills = [{ type: "SOLID", color: hexToRgb(c.primary["500"]) }];
    badgeDef.layoutSizingHorizontal = "HUG"; badgeDef.layoutSizingVertical = "HUG";
    var bt1 = figma.createText();
    bt1.fontName = { family: font.name, style: font.semibold };
    bt1.characters = "Badge";
    bt1.fontSize = 12; bt1.lineHeight = { value: 16, unit: "PIXELS" };
    bt1.fills = [{ type: "SOLID", color: hexToRgb(c.primary["900"]) }];
    badgeDef.appendChild(bt1);
    badgeDef.x = xPos; badgeDef.y = yPos;
    
    var badgeSuccess = figma.createComponent();
    badgeSuccess.name = "Badge / Success";
    badgeSuccess.layoutMode = "HORIZONTAL";
    badgeSuccess.primaryAxisAlignItems = "CENTER";
    badgeSuccess.counterAxisAlignItems = "CENTER";
    badgeSuccess.paddingLeft = 10; badgeSuccess.paddingRight = 10;
    badgeSuccess.paddingTop = 2; badgeSuccess.paddingBottom = 2;
    badgeSuccess.cornerRadius = 9999;
    badgeSuccess.fills = [{ type: "SOLID", color: hexToRgb(c.status["successBg"]) }];
    badgeSuccess.layoutSizingHorizontal = "HUG"; badgeSuccess.layoutSizingVertical = "HUG";
    var bt2 = figma.createText();
    bt2.fontName = { family: font.name, style: font.semibold };
    bt2.characters = "Success";
    bt2.fontSize = 12; bt2.lineHeight = { value: 16, unit: "PIXELS" };
    bt2.fills = [{ type: "SOLID", color: hexToRgb(c.status["success"]) }];
    badgeSuccess.appendChild(bt2);
    badgeSuccess.x = xPos + 80; badgeSuccess.y = yPos;
    
    var badgeErr = figma.createComponent();
    badgeErr.name = "Badge / Error";
    badgeErr.layoutMode = "HORIZONTAL";
    badgeErr.primaryAxisAlignItems = "CENTER";
    badgeErr.counterAxisAlignItems = "CENTER";
    badgeErr.paddingLeft = 10; badgeErr.paddingRight = 10;
    badgeErr.paddingTop = 2; badgeErr.paddingBottom = 2;
    badgeErr.cornerRadius = 9999;
    badgeErr.fills = [{ type: "SOLID", color: hexToRgb(c.status["errorBg"]) }];
    badgeErr.layoutSizingHorizontal = "HUG"; badgeErr.layoutSizingVertical = "HUG";
    var bt3 = figma.createText();
    bt3.fontName = { family: font.name, style: font.semibold };
    bt3.characters = "Error";
    bt3.fontSize = 12; bt3.lineHeight = { value: 16, unit: "PIXELS" };
    bt3.fills = [{ type: "SOLID", color: hexToRgb(c.status["error"]) }];
    badgeErr.appendChild(bt3);
    badgeErr.x = xPos + 170; badgeErr.y = yPos;
    
    yPos += 50;
    
    // ============ AVATARS ============
    var avSm = figma.createComponent();
    avSm.name = "Avatar / sm";
    avSm.layoutMode = "HORIZONTAL";
    avSm.primaryAxisAlignItems = "CENTER";
    avSm.counterAxisAlignItems = "CENTER";
    avSm.resize(32, 32);
    avSm.cornerRadius = 16;
    avSm.fills = [{ type: "SOLID", color: hexToRgb(c.primary["500"]) }];
    var avt1 = figma.createText();
    avt1.fontName = { family: font.name, style: font.medium };
    avt1.characters = "AB";
    avt1.fontSize = 12;
    avt1.fills = [{ type: "SOLID", color: hexToRgb(c.primary["900"]) }];
    avSm.appendChild(avt1);
    avSm.x = xPos; avSm.y = yPos;
    
    var avMd = figma.createComponent();
    avMd.name = "Avatar / md";
    avMd.layoutMode = "HORIZONTAL";
    avMd.primaryAxisAlignItems = "CENTER";
    avMd.counterAxisAlignItems = "CENTER";
    avMd.resize(40, 40);
    avMd.cornerRadius = 20;
    avMd.fills = [{ type: "SOLID", color: hexToRgb(c.primary["500"]) }];
    var avt2 = figma.createText();
    avt2.fontName = { family: font.name, style: font.medium };
    avt2.characters = "AB";
    avt2.fontSize = 14;
    avt2.fills = [{ type: "SOLID", color: hexToRgb(c.primary["900"]) }];
    avMd.appendChild(avt2);
    avMd.x = xPos + 50; avMd.y = yPos;
    
    var avLg = figma.createComponent();
    avLg.name = "Avatar / lg";
    avLg.layoutMode = "HORIZONTAL";
    avLg.primaryAxisAlignItems = "CENTER";
    avLg.counterAxisAlignItems = "CENTER";
    avLg.resize(64, 64);
    avLg.cornerRadius = 32;
    avLg.fills = [{ type: "SOLID", color: hexToRgb(c.primary["500"]) }];
    var avt3 = figma.createText();
    avt3.fontName = { family: font.name, style: font.medium };
    avt3.characters = "AB";
    avt3.fontSize = 24;
    avt3.fills = [{ type: "SOLID", color: hexToRgb(c.primary["900"]) }];
    avLg.appendChild(avt3);
    avLg.x = xPos + 110; avLg.y = yPos;
    
    yPos += 90;
    
    // ============ UTILITIES ============
    var prog = figma.createComponent();
    prog.name = "Progress";
    prog.resize(200, 8);
    prog.cornerRadius = 9999;
    prog.fills = [{ type: "SOLID", color: hexToRgb(c.primary["700"]) }];
    prog.clipsContent = true;
    prog.layoutMode = "HORIZONTAL";
    var progBar = figma.createFrame();
    progBar.name = "Bar";
    progBar.resize(120, 8);
    progBar.cornerRadius = 9999;
    progBar.fills = [{ type: "SOLID", color: hexToRgb(c.primary["500"]) }];
    prog.appendChild(progBar);
    prog.x = xPos; prog.y = yPos;
    
    var sep = figma.createComponent();
    sep.name = "Separator";
    sep.resize(200, 1);
    sep.fills = [{ type: "SOLID", color: hexToRgb(c.primary["600"]) }];
    sep.x = xPos; sep.y = yPos + 30;
    
    var skel = figma.createComponent();
    skel.name = "Skeleton";
    skel.resize(200, 20);
    skel.cornerRadius = 8;
    skel.fills = [{ type: "SOLID", color: hexToRgb(c.primary["700"]) }];
    skel.x = xPos; skel.y = yPos + 50;
    
    console.log("Components 생성 완료 - 폰트:", font.name);
    return true;
    */
}

// UI 메시지 핸들러
figma.ui.onmessage = function (msg) {
    if (msg.type === 'close') {
        figma.closePlugin();
        return;
    }

    // 기존 스타일/변수/컴포넌트 삭제
    if (msg.type === 'clear-all') {
        var deletedCount = { styles: 0, variables: 0, nodes: 0 };

        // Text Styles 삭제
        figma.getLocalTextStyles().forEach(function (style) {
            style.remove();
            deletedCount.styles++;
        });

        // Effect Styles 삭제
        figma.getLocalEffectStyles().forEach(function (style) {
            style.remove();
            deletedCount.styles++;
        });

        // Paint Styles 삭제
        figma.getLocalPaintStyles().forEach(function (style) {
            style.remove();
            deletedCount.styles++;
        });

        // Variables 삭제
        try {
            var collections = figma.variables.getLocalVariableCollections();
            collections.forEach(function (collection) {
                collection.remove();
                deletedCount.variables++;
            });
        } catch (e) {
            console.log("Variables 삭제 실패:", e.message);
        }

        // 현재 페이지의 모든 노드 삭제
        figma.currentPage.children.forEach(function (node) {
            node.remove();
            deletedCount.nodes++;
        });

        figma.ui.postMessage({
            type: 'status',
            status: 'success',
            message: '삭제 완료! Styles: ' + deletedCount.styles + ', Variables: ' + deletedCount.variables + ', Nodes: ' + deletedCount.nodes
        });
        figma.notify('🗑️ 삭제 완료!');
        return;
    }

    if (msg.type === 'create') {
        var options = msg.options;
        var files = options.files;

        // 파일에서 토큰 파싱
        var importedTokens = parseTokenFiles(files);

        // 기본 토큰과 병합
        var mergedTokens = mergeTokens(tokens, importedTokens);

        // 생성 시작
        try {
            if (options.createVariables) {
                createVariablesFromTokens(mergedTokens);
                figma.ui.postMessage({ type: 'status', status: 'success', message: '✅ Variables 생성 완료!' });
            }

            // typography.json에서 원본 폰트 추출
            var originalFont = null;
            if (mergedTokens.typography && mergedTokens.typography.fontFamily) {
                originalFont = mergedTokens.typography.fontFamily.sans || mergedTokens.typography.fontFamily.primary;
            }

            loadFonts(originalFont).then(function (font) {
                return loadPretendard().then(function () { return font; }).catch(function () { return font; });
            }).then(function (font) {
                var styleMap = {};

                if (options.createTextStyles) {
                    styleMap = createTextStylesFromTokens(mergedTokens, font);
                    figma.ui.postMessage({ type: 'status', status: 'success', message: '✅ Text Styles 생성 완료!' });
                }

                if (options.createComponents) {
                    createComponents(font, styleMap, mergedTokens);
                    figma.ui.postMessage({ type: 'status', status: 'success', message: '✅ 컴포넌트 생성 완료!' });
                }

                figma.ui.postMessage({ type: 'status', status: 'success', message: '🎉 모든 작업 완료!' });
            }).catch(function (err) {
                figma.ui.postMessage({ type: 'status', status: 'error', message: '❌ 폰트 로드 실패: ' + err });
            });
        } catch (err) {
            figma.ui.postMessage({ type: 'status', status: 'error', message: '❌ 에러: ' + err });
        }
    }

    // ===== Export 기능 =====

    // 선택한 프레임 스캔
    if (msg.type === 'scan-frames') {
        var selection = figma.currentPage.selection;
        if (selection.length === 0) {
            figma.ui.postMessage({ type: 'status', status: 'error', message: '프레임을 먼저 선택하세요' });
            return;
        }

        var components = [];
        selection.forEach(function (node) {
            if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE' || node.type === 'GROUP') {
                components.push({
                    id: node.id,
                    name: node.name,
                    width: Math.round(node.width),
                    height: Math.round(node.height),
                    type: node.type
                });
            }
        });

        figma.ui.postMessage({ type: 'scan-result', components: components });
        return;
    }

    // HTML로 내보내기
    if (msg.type === 'export-html') {
        var opts = msg.options;
        var selectedIds = opts.selectedIds || [];
        var separateCSS = opts.separateCSS;
        var createPreview = opts.createPreview;

        var files = [];
        var allCSS = [];
        var componentNames = [];

        selectedIds.forEach(function (id) {
            var node = figma.getNodeById(id);
            if (!node) return;

            var result = figmaNodeToHTML(node, separateCSS);
            var safeName = node.name.replace(/[^a-zA-Z0-9가-힣]/g, '-').toLowerCase();
            componentNames.push({ name: node.name, file: safeName + '.html' });

            if (separateCSS) {
                allCSS.push(result.css);
                files.push({
                    name: safeName + '.html',
                    content: generateHTMLFile(safeName, result.html, null, separateCSS)
                });
            } else {
                files.push({
                    name: safeName + '.html',
                    content: generateHTMLFile(safeName, result.html, result.css, false)
                });
            }
        });

        // 별도 CSS 파일
        if (separateCSS && allCSS.length > 0) {
            files.push({
                name: 'styles.css',
                content: allCSS.join('\n\n')
            });
        }

        // 프리뷰 페이지
        if (createPreview) {
            var previewHTML = generatePreviewHTML(componentNames, separateCSS);
            files.push({
                name: 'preview.html',
                content: previewHTML
            });
        }

        figma.ui.postMessage({ type: 'export-result', files: files });
        return;
    }

    // ===== Design System Export =====
    if (msg.type === 'export-design-system') {
        var opts = msg.options || {};
        var exportColors = opts.exportColors !== false;
        var exportTypography = opts.exportTypography !== false;
        var exportComponents = opts.exportComponents !== false;
        var generateStyleGuide = opts.generateStyleGuide !== false;

        figma.ui.postMessage({ type: 'status', status: 'info', message: '📊 디자인 시스템 추출 중...' });

        var designSystem = {
            colors: {},
            typography: {},
            spacing: {},
            borderRadius: {},
            components: []
        };

        // 1. Variables 추출 (Colors, Spacing, Radius)
        if (exportColors) {
            try {
                var collections = figma.variables.getLocalVariableCollections();
                collections.forEach(function (collection) {
                    var variables = collection.variableIds.map(function (id) {
                        return figma.variables.getVariableById(id);
                    });

                    variables.forEach(function (variable) {
                        if (!variable) return;
                        var value = variable.valuesByMode[collection.defaultModeId];
                        var name = variable.name.replace(/\//g, '-');

                        if (variable.resolvedType === 'COLOR' && value) {
                            var hex = rgbToHex(value.r, value.g, value.b);
                            designSystem.colors[name] = hex;
                        } else if (variable.resolvedType === 'FLOAT' && value !== undefined) {
                            if (variable.name.toLowerCase().includes('radius')) {
                                designSystem.borderRadius[name] = value;
                            } else {
                                designSystem.spacing[name] = value;
                            }
                        }
                    });
                });
            } catch (e) {
                console.log('Variables 추출 실패:', e.message);
            }
        }

        // 2. Text Styles 추출
        if (exportTypography) {
            var textStyles = figma.getLocalTextStyles();
            textStyles.forEach(function (style) {
                designSystem.typography[style.name] = {
                    fontFamily: style.fontName ? style.fontName.family : 'Inter',
                    fontWeight: style.fontName ? getFontWeight(style.fontName.style) : 400,
                    fontSize: style.fontSize || 16,
                    lineHeight: style.lineHeight ? (style.lineHeight.unit === 'PIXELS' ? style.lineHeight.value : style.lineHeight.value + '%') : 'auto',
                    letterSpacing: style.letterSpacing ? style.letterSpacing.value : 0
                };
            });
        }

        // 3. Components 추출
        if (exportComponents) {
            var componentPage = figma.root.children.find(function (p) {
                return p.name.toLowerCase().includes('component') || p.name.toLowerCase().includes('design system');
            }) || figma.currentPage;

            // 현재 선택이 있으면 선택된 것만, 없으면 페이지의 모든 컴포넌트
            var nodesToExport = figma.currentPage.selection.length > 0
                ? figma.currentPage.selection
                : componentPage.findAll(function (n) { return n.type === 'COMPONENT'; });

            nodesToExport.forEach(function (node) {
                if (node.type === 'COMPONENT' || node.type === 'FRAME' || node.type === 'INSTANCE') {
                    var result = exportNodeToHTML(node);
                    designSystem.components.push({
                        name: node.name,
                        width: Math.round(node.width),
                        height: Math.round(node.height),
                        html: result.html,
                        css: result.css
                    });
                }
            });
        }

        // 4. 파일 생성
        var files = [];

        // tokens.json
        files.push({
            name: 'tokens.json',
            content: JSON.stringify({
                colors: designSystem.colors,
                typography: designSystem.typography,
                spacing: designSystem.spacing,
                borderRadius: designSystem.borderRadius
            }, null, 2)
        });

        // 컴포넌트별 HTML
        designSystem.components.forEach(function (comp) {
            var safeName = comp.name.replace(/[^a-zA-Z0-9가-힣]/g, '-').toLowerCase();
            files.push({
                name: 'components/' + safeName + '.html',
                content: generateComponentHTML(comp)
            });
        });

        // Style Guide
        if (generateStyleGuide) {
            files.push({
                name: 'styleguide.html',
                content: generateStyleGuideHTML(designSystem)
            });
        }

        figma.ui.postMessage({ type: 'export-result', files: files });
        figma.ui.postMessage({ type: 'status', status: 'success', message: '✅ 디자인 시스템 추출 완료! ' + files.length + '개 파일' });
        return;
    }
};

// ===== Export Helper Functions =====

function figmaNodeToHTML(node, separateCSS) {
    var html = '';
    var css = '';
    var className = 'c-' + node.id.replace(/[^a-zA-Z0-9]/g, '');

    // CSS 클래스 생성
    var styles = extractNodeStyles(node);
    css += '.' + className + ' {\n';
    css += styles.map(function (s) { return '  ' + s; }).join('\n');
    css += '\n}\n';

    // HTML 생성
    if (node.type === 'TEXT') {
        html = '<span class="' + className + '">' + (node.characters || '') + '</span>';
    } else {
        html = '<div class="' + className + '">';

        // 자식 요소 재귀 처리
        if ('children' in node && node.children) {
            node.children.forEach(function (child) {
                var childResult = figmaNodeToHTML(child, separateCSS);
                html += '\n  ' + childResult.html;
                css += childResult.css;
            });
        }

        html += '\n</div>';
    }

    return { html: html, css: css };
}

function extractNodeStyles(node) {
    var styles = [];

    // 크기
    if (node.width) styles.push('width: ' + Math.round(node.width) + 'px;');
    if (node.height) styles.push('height: ' + Math.round(node.height) + 'px;');

    // 위치 (부모 기준 상대 위치)
    if (node.x !== undefined && node.x !== 0) styles.push('left: ' + Math.round(node.x) + 'px;');
    if (node.y !== undefined && node.y !== 0) styles.push('top: ' + Math.round(node.y) + 'px;');
    if (node.x !== 0 || node.y !== 0) styles.push('position: absolute;');

    // 배경색
    if ('fills' in node && node.fills && node.fills.length > 0) {
        var fill = node.fills[0];
        if (fill.type === 'SOLID' && fill.visible !== false) {
            var r = Math.round(fill.color.r * 255);
            var g = Math.round(fill.color.g * 255);
            var b = Math.round(fill.color.b * 255);
            var a = fill.opacity !== undefined ? fill.opacity : 1;
            styles.push('background: rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ');');
        }
    }

    // 테두리
    if ('strokes' in node && node.strokes && node.strokes.length > 0) {
        var stroke = node.strokes[0];
        if (stroke.type === 'SOLID' && stroke.visible !== false) {
            var sr = Math.round(stroke.color.r * 255);
            var sg = Math.round(stroke.color.g * 255);
            var sb = Math.round(stroke.color.b * 255);
            var sw = (node.strokeWeight && node.strokeWeight !== figma.mixed) ? node.strokeWeight : 1;
            styles.push('border: ' + sw + 'px solid rgb(' + sr + ', ' + sg + ', ' + sb + ');');
        }
    }

    // 모서리 둥글기
    if ('cornerRadius' in node && node.cornerRadius && typeof node.cornerRadius === 'number') {
        styles.push('border-radius: ' + node.cornerRadius + 'px;');
    }

    // 텍스트 스타일
    if (node.type === 'TEXT') {
        if (node.fontSize && typeof node.fontSize === 'number') styles.push('font-size: ' + node.fontSize + 'px;');
        if (node.fontWeight && typeof node.fontWeight === 'number') styles.push('font-weight: ' + node.fontWeight + ';');
        if (node.lineHeight && typeof node.lineHeight === 'object' && node.lineHeight.value) {
            styles.push('line-height: ' + node.lineHeight.value + (node.lineHeight.unit === 'PERCENT' ? '%' : 'px') + ';');
        }
        // 텍스트 색상
        if ('fills' in node && node.fills && node.fills.length > 0) {
            var tf = node.fills[0];
            if (tf.type === 'SOLID') {
                var tr = Math.round(tf.color.r * 255);
                var tg = Math.round(tf.color.g * 255);
                var tb = Math.round(tf.color.b * 255);
                styles.push('color: rgb(' + tr + ', ' + tg + ', ' + tb + ');');
            }
        }
    }

    // Auto Layout → Flexbox
    if ('layoutMode' in node && node.layoutMode !== 'NONE') {
        styles.push('display: flex;');
        styles.push('flex-direction: ' + (node.layoutMode === 'HORIZONTAL' ? 'row' : 'column') + ';');
        if (node.itemSpacing) styles.push('gap: ' + node.itemSpacing + 'px;');
        if (node.paddingTop) styles.push('padding-top: ' + node.paddingTop + 'px;');
        if (node.paddingRight) styles.push('padding-right: ' + node.paddingRight + 'px;');
        if (node.paddingBottom) styles.push('padding-bottom: ' + node.paddingBottom + 'px;');
        if (node.paddingLeft) styles.push('padding-left: ' + node.paddingLeft + 'px;');

        // 정렬
        if (node.primaryAxisAlignItems === 'CENTER') styles.push('justify-content: center;');
        if (node.primaryAxisAlignItems === 'MAX') styles.push('justify-content: flex-end;');
        if (node.primaryAxisAlignItems === 'SPACE_BETWEEN') styles.push('justify-content: space-between;');
        if (node.counterAxisAlignItems === 'CENTER') styles.push('align-items: center;');
        if (node.counterAxisAlignItems === 'MAX') styles.push('align-items: flex-end;');
    } else if ('children' in node && node.children && node.children.length > 0) {
        // 자식이 있으면 position relative
        styles.push('position: relative;');
    }

    return styles;
}

function generateHTMLFile(name, bodyContent, css, useSeparateCSS) {
    var styleTag = '';
    if (useSeparateCSS) {
        styleTag = '<link rel="stylesheet" href="styles.css">';
    } else if (css) {
        styleTag = '<style>\n' + css + '</style>';
    }

    return '<!DOCTYPE html>\n<html lang="ko">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>' + name + '</title>\n  ' + styleTag + '\n</head>\n<body>\n  ' + bodyContent + '\n</body>\n</html>';
}

function generatePreviewHTML(componentNames, useSeparateCSS) {
    var links = componentNames.map(function (c) {
        return '    <li><a href="' + c.file + '">' + c.name + '</a></li>';
    }).join('\n');

    var styleLink = useSeparateCSS ? '<link rel="stylesheet" href="styles.css">' : '';

    return '<!DOCTYPE html>\n<html lang="ko">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Component Preview</title>\n  ' + styleLink + '\n  <style>\n    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 24px; }\n    h1 { margin-bottom: 16px; }\n    ul { list-style: none; padding: 0; }\n    li { margin: 8px 0; }\n    a { color: #0d99ff; text-decoration: none; }\n    a:hover { text-decoration: underline; }\n  </style>\n</head>\n<body>\n  <h1>📦 Exported Components</h1>\n  <ul>\n' + links + '\n  </ul>\n</body>\n</html>';
}

// ===== Design System Export Helper Functions =====

function rgbToHex(r, g, b) {
    var toHex = function (c) {
        var hex = Math.round(c * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return '#' + toHex(r) + toHex(g) + toHex(b);
}

function getFontWeight(styleName) {
    var weights = {
        'Thin': 100, 'ExtraLight': 200, 'Light': 300, 'Regular': 400,
        'Medium': 500, 'SemiBold': 600, 'Bold': 700, 'ExtraBold': 800, 'Black': 900
    };
    for (var key in weights) {
        if (styleName && styleName.indexOf(key) !== -1) return weights[key];
    }
    return 400;
}

function exportNodeToHTML(node) {
    var html = '';
    var css = '';
    var className = 'comp-' + node.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

    // 노드 스타일 추출
    var styles = extractNodeStyles(node);
    css += '.' + className + ' {\n';
    css += styles.map(function (s) { return '  ' + s; }).join('\n');
    css += '\n}\n';

    // HTML 생성
    if (node.type === 'TEXT') {
        html = '<span class="' + className + '">' + (node.characters || '') + '</span>';
    } else {
        html = '<div class="' + className + '">';

        // 자식 요소 재귀 처리
        if ('children' in node && node.children) {
            node.children.forEach(function (child) {
                var childResult = exportNodeToHTML(child);
                html += '\n  ' + childResult.html;
                css += childResult.css;
            });
        }

        html += '\n</div>';
    }

    return { html: html, css: css };
}

function generateComponentHTML(comp) {
    return '<!DOCTYPE html>\n<html lang="ko">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>' + comp.name + '</title>\n  <style>\n    body { font-family: -apple-system, BlinkMacSystemFont, \'Pretendard\', sans-serif; margin: 0; padding: 24px; background: #f5f5f5; }\n    .component-wrapper { background: white; border-radius: 8px; padding: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }\n    .component-info { margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #eee; }\n    .component-name { font-size: 18px; font-weight: 600; margin: 0; }\n    .component-size { font-size: 12px; color: #888; margin-top: 4px; }\n' + comp.css + '\n  </style>\n</head>\n<body>\n  <div class="component-wrapper">\n    <div class="component-info">\n      <h1 class="component-name">' + comp.name + '</h1>\n      <div class="component-size">' + comp.width + ' × ' + comp.height + 'px</div>\n    </div>\n    ' + comp.html + '\n  </div>\n</body>\n</html>';
}

function generateStyleGuideHTML(designSystem) {
    // Colors Section
    var colorsHTML = '<section class="section"><h2>🎨 Colors</h2><div class="color-grid">';
    for (var colorName in designSystem.colors) {
        var hex = designSystem.colors[colorName];
        colorsHTML += '<div class="color-card"><div class="color-swatch" style="background:' + hex + '"></div><div class="color-name">' + colorName + '</div><div class="color-value">' + hex + '</div></div>';
    }
    colorsHTML += '</div></section>';

    // Typography Section
    var typoHTML = '<section class="section"><h2>📝 Typography</h2><div class="typo-list">';
    for (var typoName in designSystem.typography) {
        var t = designSystem.typography[typoName];
        typoHTML += '<div class="typo-item"><div class="typo-sample" style="font-family:\'' + t.fontFamily + '\';font-size:' + t.fontSize + 'px;font-weight:' + t.fontWeight + ';line-height:' + t.lineHeight + '">Aa 가나다 123</div><div class="typo-info"><strong>' + typoName + '</strong><br>' + t.fontFamily + ' / ' + t.fontSize + 'px / ' + t.fontWeight + '</div></div>';
    }
    typoHTML += '</div></section>';

    // Spacing Section
    var spacingHTML = '<section class="section"><h2>📏 Spacing</h2><div class="spacing-list">';
    for (var spaceName in designSystem.spacing) {
        var val = designSystem.spacing[spaceName];
        spacingHTML += '<div class="spacing-item"><div class="spacing-bar" style="width:' + val + 'px"></div><span>' + spaceName + ': ' + val + 'px</span></div>';
    }
    spacingHTML += '</div></section>';

    // Border Radius Section
    var radiusHTML = '<section class="section"><h2>⭕ Border Radius</h2><div class="radius-list">';
    for (var radiusName in designSystem.borderRadius) {
        var r = designSystem.borderRadius[radiusName];
        radiusHTML += '<div class="radius-item"><div class="radius-sample" style="border-radius:' + r + 'px"></div><span>' + radiusName + ': ' + r + 'px</span></div>';
    }
    radiusHTML += '</div></section>';

    // Components Section
    var compsHTML = '<section class="section"><h2>🧩 Components</h2><div class="component-grid">';
    designSystem.components.forEach(function (comp) {
        var safeName = comp.name.replace(/[^a-zA-Z0-9가-힣]/g, '-').toLowerCase();
        compsHTML += '<div class="component-card"><div class="component-preview"><style>' + comp.css + '</style>' + comp.html + '</div><div class="component-label"><a href="components/' + safeName + '.html">' + comp.name + '</a><br><small>' + comp.width + '×' + comp.height + '</small></div></div>';
    });
    compsHTML += '</div></section>';

    return '<!DOCTYPE html>\n<html lang="ko">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Design System Style Guide</title>\n  <style>\n    * { box-sizing: border-box; margin: 0; padding: 0; }\n    body { font-family: -apple-system, BlinkMacSystemFont, \'Pretendard\', sans-serif; background: #f8f9fa; color: #333; }\n    header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 48px 24px; text-align: center; }\n    header h1 { font-size: 32px; margin-bottom: 8px; }\n    header p { opacity: 0.9; }\n    main { max-width: 1200px; margin: 0 auto; padding: 24px; }\n    .section { background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }\n    .section h2 { font-size: 20px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #eee; }\n    .color-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 16px; }\n    .color-card { text-align: center; }\n    .color-swatch { width: 100%; height: 80px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.1); }\n    .color-name { font-weight: 600; font-size: 12px; margin-top: 8px; }\n    .color-value { font-size: 11px; color: #888; font-family: monospace; }\n    .typo-list { display: flex; flex-direction: column; gap: 16px; }\n    .typo-item { display: flex; align-items: center; gap: 24px; padding: 12px; background: #f5f5f5; border-radius: 8px; }\n    .typo-sample { min-width: 200px; }\n    .typo-info { font-size: 12px; color: #666; }\n    .spacing-list, .radius-list { display: flex; flex-wrap: wrap; gap: 16px; }\n    .spacing-item, .radius-item { display: flex; align-items: center; gap: 12px; padding: 8px 16px; background: #f5f5f5; border-radius: 8px; font-size: 13px; }\n    .spacing-bar { height: 16px; background: linear-gradient(90deg, #667eea, #764ba2); border-radius: 4px; min-width: 4px; }\n    .radius-sample { width: 48px; height: 48px; background: linear-gradient(135deg, #667eea, #764ba2); }\n    .component-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }\n    .component-card { background: #f5f5f5; border-radius: 8px; overflow: hidden; }\n    .component-preview { padding: 24px; min-height: 100px; display: flex; align-items: center; justify-content: center; background: white; }\n    .component-label { padding: 12px; font-size: 13px; }\n    .component-label a { color: #667eea; text-decoration: none; font-weight: 600; }\n    .component-label a:hover { text-decoration: underline; }\n    .component-label small { color: #888; }\n  </style>\n</head>\n<body>\n  <header>\n    <h1>📚 Design System</h1>\n    <p>Style Guide & Components</p>\n  </header>\n  <main>\n' + colorsHTML + '\n' + typoHTML + '\n' + spacingHTML + '\n' + radiusHTML + '\n' + compsHTML + '\n  </main>\n</body>\n</html>';
}

// ============================================
// 트리 구조 노드 생성 (새 버전)
// ============================================
function createTreeNode(comp, parent, colors, font, offsetX, offsetY) {
    var node;

    // 타입에 따라 노드 생성
    if (comp.type === 'text' && comp.text) {
        // 텍스트 노드: 프레임 안에 텍스트
        node = figma.createFrame();
        node.name = comp.name;
        node.resize(comp.width || 100, comp.height || 20);
        node.fills = comp.background ? [{ type: "SOLID", color: hexToRgb(comp.background) }] : [];
        node.layoutMode = "HORIZONTAL";
        node.counterAxisAlignItems = "CENTER";
        node.clipsContent = true;

        // textAlign에 따른 정렬
        if (comp.text.textAlign === "center") {
            node.primaryAxisAlignItems = "CENTER";
        } else if (comp.text.textAlign === "right" || comp.text.textAlign === "end") {
            node.primaryAxisAlignItems = "MAX";
        } else {
            node.primaryAxisAlignItems = "MIN";
        }

        var textNode = figma.createText();
        textNode.fontName = { family: font.name, style: font.regular };
        if (comp.text.fontWeight >= 600) textNode.fontName = { family: font.name, style: font.semibold };
        else if (comp.text.fontWeight >= 500) textNode.fontName = { family: font.name, style: font.medium };
        textNode.characters = comp.text.content || "Text";
        textNode.fontSize = comp.text.fontSize || 14;
        // 너비 고정, 높이만 자동 (줄바꿈 지원)
        textNode.resize(comp.width || 100, comp.height || 20);
        textNode.textAutoResize = "HEIGHT";

        // 텍스트 정렬 설정
        if (comp.text.textAlign === "center") {
            textNode.textAlignHorizontal = "CENTER";
        } else if (comp.text.textAlign === "right" || comp.text.textAlign === "end") {
            textNode.textAlignHorizontal = "RIGHT";
        } else {
            textNode.textAlignHorizontal = "LEFT";
        }

        var textColor = comp.text.color || "#000000";
        textNode.fills = [{ type: "SOLID", color: hexToRgb(textColor) }];
        node.appendChild(textNode);
    } else {
        // 프레임 노드
        node = figma.createFrame();
        node.name = comp.name;
        node.resize(comp.width || 100, comp.height || 100);
        node.layoutMode = "NONE"; // 자식 요소는 상대 좌표로 배치

        // v5.38: icon 자식이 있으면 clipsContent=true (영역 침범 방지)
        var hasIconChild = comp.children && comp.children.some(function (c) { return c.type === 'icon'; });
        if (hasIconChild || comp.hasSvgIcon) {
            node.clipsContent = true;
        }

        // 배경색
        if (comp.background) {
            node.fills = [{ type: "SOLID", color: hexToRgb(comp.background) }];
        } else {
            node.fills = [];
        }

        // 그라데이션
        if (comp.gradient) {
            try {
                var gradColors = comp.gradient.match(/rgb\([^)]+\)|#[0-9a-fA-F]{6}/g);
                if (gradColors && gradColors.length >= 2) {
                    function rgbStrToHex(s) {
                        var m = s.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
                        if (m) return "#" + [m[1], m[2], m[3]].map(function (x) { x = parseInt(x); return (x < 16 ? "0" : "") + x.toString(16); }).join("");
                        return s;
                    }
                    var c1 = gradColors[0].startsWith("#") ? gradColors[0] : rgbStrToHex(gradColors[0]);
                    var c2 = gradColors[1].startsWith("#") ? gradColors[1] : rgbStrToHex(gradColors[1]);
                    node.fills = [{
                        type: "GRADIENT_LINEAR",
                        gradientTransform: [[1, 0, 0], [0, 1, 0]],
                        gradientStops: [
                            { position: 0, color: Object.assign({}, hexToRgb(c1), { a: 1 }) },
                            { position: 1, color: Object.assign({}, hexToRgb(c2), { a: 1 }) }
                        ]
                    }];
                }
            } catch (e) { /* skip gradient */ }
        }

        // 테두리
        if (comp.border && comp.border.color) {
            node.strokes = [{ type: "SOLID", color: hexToRgb(comp.border.color) }];
            node.strokeAlign = "INSIDE";

            // 개별 변별 border width 설정
            if (comp.border.top !== undefined || comp.border.bottom !== undefined ||
                comp.border.left !== undefined || comp.border.right !== undefined) {
                // 개별 변 두께 설정 (Figma의 individualStrokeWeights 사용)
                node.strokeTopWeight = comp.border.top || 0;
                node.strokeRightWeight = comp.border.right || 0;
                node.strokeBottomWeight = comp.border.bottom || 0;
                node.strokeLeftWeight = comp.border.left || 0;
            } else {
                node.strokeWeight = comp.border.width || 1;
            }
        }

        // cornerRadius
        if (comp.cornerRadius) {
            if (typeof comp.cornerRadius === "object") {
                node.topLeftRadius = comp.cornerRadius.topLeft || 0;
                node.topRightRadius = comp.cornerRadius.topRight || 0;
                node.bottomRightRadius = comp.cornerRadius.bottomRight || 0;
                node.bottomLeftRadius = comp.cornerRadius.bottomLeft || 0;
            } else {
                node.cornerRadius = comp.cornerRadius;
            }
        }

        // shadow
        if (comp.shadow && comp.shadow.color) {
            var sRgb = hexToRgb(comp.shadow.color);
            node.effects = [{
                type: "DROP_SHADOW",
                color: { r: sRgb.r, g: sRgb.g, b: sRgb.b, a: 0.25 },
                offset: { x: comp.shadow.x || 0, y: comp.shadow.y || 4 },
                radius: comp.shadow.blur || 8,
                visible: true,
                blendMode: "NORMAL"
            }];
        }

        // padding 적용
        if (comp.padding) {
            node.paddingTop = comp.padding.top || 0;
            node.paddingRight = comp.padding.right || 0;
            node.paddingBottom = comp.padding.bottom || 0;
            node.paddingLeft = comp.padding.left || 0;
        }

        // 텍스트 내용이 있으면 추가
        if (comp.text && comp.text.content) {
            node.layoutMode = "HORIZONTAL";
            node.counterAxisAlignItems = "CENTER";
            node.clipsContent = true;

            // textAlign에 따른 정렬
            if (comp.text.textAlign === "center") {
                node.primaryAxisAlignItems = "CENTER";
            } else if (comp.text.textAlign === "right" || comp.text.textAlign === "end") {
                node.primaryAxisAlignItems = "MAX";
            } else {
                node.primaryAxisAlignItems = "MIN";
            }

            var textChild = figma.createText();
            textChild.fontName = { family: font.name, style: font.regular };
            if (comp.text.fontWeight >= 600) textChild.fontName = { family: font.name, style: font.semibold };
            else if (comp.text.fontWeight >= 500) textChild.fontName = { family: font.name, style: font.medium };
            textChild.characters = comp.text.content;
            textChild.fontSize = comp.text.fontSize || 14;
            // 너비 고정, 높이만 자동 (줄바꿈 지원)
            textChild.resize(comp.width || 100, comp.height || 20);
            textChild.textAutoResize = "HEIGHT";

            // 텍스트 정렬 설정
            if (comp.text.textAlign === "center") {
                textChild.textAlignHorizontal = "CENTER";
            } else if (comp.text.textAlign === "right" || comp.text.textAlign === "end") {
                textChild.textAlignHorizontal = "RIGHT";
            } else {
                textChild.textAlignHorizontal = "LEFT";
            }

            var txtColor = comp.text.color || "#000000";
            textChild.fills = [{ type: "SOLID", color: hexToRgb(txtColor) }];
            node.appendChild(textChild);
        }
    }

    // icon 타입: 아이콘 placeholder 생성
    if (comp.type === 'icon') {
        // 아이콘은 파란색 placeholder로 표시
        node.fills = [{ type: "SOLID", color: { r: 0.4, g: 0.4, b: 1 } }];
        node.cornerRadius = Math.min(comp.width || 24, comp.height || 24) / 4;

        // 아이콘 라벨 추가
        try {
            node.layoutMode = "HORIZONTAL";
            node.counterAxisAlignItems = "CENTER";
            node.primaryAxisAlignItems = "CENTER";
            var iconLabel = figma.createText();
            iconLabel.fontName = { family: font.name, style: font.regular };
            iconLabel.characters = "⬡";  // 아이콘 placeholder 심볼
            iconLabel.fontSize = Math.min(comp.width || 16, comp.height || 16) * 0.6;
            iconLabel.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
            node.appendChild(iconLabel);
        } catch (iconErr) { /* skip icon label */ }
    }

    // image 타입: 이미지 placeholder 생성
    if (comp.type === 'image') {
        // 이미지는 회색 placeholder로 표시
        node.fills = [{ type: "SOLID", color: { r: 0.85, g: 0.85, b: 0.85 } }];
        node.cornerRadius = comp.cornerRadius || 0;

        // 이미지 placeholder 라벨 추가
        try {
            // 이미지 심볼 - 중앙에 절대 위치로 배치
            var imgSymbol = figma.createText();
            imgSymbol.fontName = { family: font.name, style: font.regular };
            imgSymbol.characters = "🖼";
            imgSymbol.fontSize = Math.min(comp.width || 48, comp.height || 48) * 0.2;
            imgSymbol.fills = [{ type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }];
            node.appendChild(imgSymbol);
            // 중앙 배치
            imgSymbol.x = ((comp.width || 48) - imgSymbol.width) / 2;
            imgSymbol.y = ((comp.height || 48) - imgSymbol.height) / 2 - 10;

            // 크기 정보
            var imgSize = figma.createText();
            imgSize.fontName = { family: font.name, style: font.regular };
            imgSize.characters = (comp.width || 0) + "x" + (comp.height || 0);
            imgSize.fontSize = Math.max(10, Math.min(14, (comp.width || 48) * 0.05));
            imgSize.fills = [{ type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }];
            node.appendChild(imgSize);
            // 중앙 하단 배치
            imgSize.x = ((comp.width || 48) - imgSize.width) / 2;
            imgSize.y = ((comp.height || 48) - imgSize.height) / 2 + 10;
        } catch (imgErr) { /* skip image label */ }

        // 이미지 URL을 노드 설명에 저장 (나중에 수동으로 교체 가능)
        if (comp.imageSrc) {
            node.name = "Image / " + (comp.width || 0) + "x" + (comp.height || 0);
            // 플러그인 데이터에 URL 저장
            node.setPluginData("imageSrc", comp.imageSrc);
        }
    }

    // video/canvas/iframe 타입: 미디어 placeholder 생성
    if (comp.type === 'video' || comp.type === 'canvas' || comp.type === 'iframe') {
        // 검정색 배경의 미디어 placeholder
        node.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.1 } }];
        node.cornerRadius = comp.cornerRadius || 0;

        try {
            // 미디어 심볼 - 중앙에 절대 위치로 배치
            var mediaSymbol = figma.createText();
            mediaSymbol.fontName = { family: font.name, style: font.regular };
            if (comp.type === 'video') {
                mediaSymbol.characters = "▶";
            } else if (comp.type === 'canvas') {
                mediaSymbol.characters = "◼";
            } else {
                mediaSymbol.characters = "⧉";
            }
            mediaSymbol.fontSize = Math.min(comp.width || 48, comp.height || 48) * 0.15;
            mediaSymbol.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
            node.appendChild(mediaSymbol);
            // 중앙 배치
            mediaSymbol.x = ((comp.width || 48) - mediaSymbol.width) / 2;
            mediaSymbol.y = ((comp.height || 48) - mediaSymbol.height) / 2 - 15;

            // 타입 및 크기 정보
            var mediaInfo = figma.createText();
            mediaInfo.fontName = { family: font.name, style: font.regular };
            mediaInfo.characters = comp.type.toUpperCase() + " / " + (comp.width || 0) + "x" + (comp.height || 0);
            mediaInfo.fontSize = Math.max(10, Math.min(14, (comp.width || 48) * 0.04));
            mediaInfo.fills = [{ type: "SOLID", color: { r: 0.7, g: 0.7, b: 0.7 } }];
            node.appendChild(mediaInfo);
            // 중앙 하단 배치
            mediaInfo.x = ((comp.width || 48) - mediaInfo.width) / 2;
            mediaInfo.y = ((comp.height || 48) - mediaInfo.height) / 2 + 15;
        } catch (mediaErr) { /* skip media label */ }
    }

    // 위치 설정 (상대 좌표)
    node.x = (comp.x || 0) + offsetX;
    node.y = (comp.y || 0) + offsetY;

    // 부모에 추가
    if (parent) {
        parent.appendChild(node);
    }

    // hasSvgIcon이 있으면 아이콘 placeholder 추가 (실제 크기 그대로)
    // v5.38: 자식에 이미 icon 타입이 있으면 스킵 (중복 방지)
    var hasIconChild = comp.children && comp.children.some(function (c) { return c.type === 'icon'; });
    if (comp.hasSvgIcon && comp.svgIcon && !hasIconChild) {
        try {
            // 부모에 clipsContent 설정 (영역 침범 방지)
            node.clipsContent = true;

            var iconNode = figma.createFrame();
            iconNode.name = "Icon / " + comp.svgIcon.width + "x" + comp.svgIcon.height;
            iconNode.resize(comp.svgIcon.width || 24, comp.svgIcon.height || 24);
            iconNode.x = comp.svgIcon.x || 0;
            iconNode.y = comp.svgIcon.y || 0;
            iconNode.fills = [{ type: "SOLID", color: { r: 0.4, g: 0.4, b: 1 } }];
            iconNode.cornerRadius = Math.min(comp.svgIcon.width || 24, comp.svgIcon.height || 24) / 4;

            // 아이콘 심볼 추가
            iconNode.layoutMode = "HORIZONTAL";
            iconNode.counterAxisAlignItems = "CENTER";
            iconNode.primaryAxisAlignItems = "CENTER";
            var iconSymbol = figma.createText();
            iconSymbol.fontName = { family: font.name, style: font.regular };
            iconSymbol.characters = "⬡";
            iconSymbol.fontSize = Math.min(comp.svgIcon.width || 16, comp.svgIcon.height || 16) * 0.6;
            iconSymbol.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
            iconNode.appendChild(iconSymbol);

            node.appendChild(iconNode);
        } catch (svgErr) { /* ignore SVG icon creation error */ }
    }

    // 자식 요소 재귀 생성
    if (comp.children && comp.children.length > 0) {
        for (var i = 0; i < comp.children.length; i++) {
            createTreeNode(comp.children[i], node, colors, font, 0, 0);
        }

        // v5.39: 자식들의 최대 범위에 맞게 부모 크기 자동 확장
        // (슬라이더 등 overflow:hidden으로 잘린 컨테이너 보정)
        var maxChildRight = 0;
        var maxChildBottom = 0;
        for (var j = 0; j < node.children.length; j++) {
            var child = node.children[j];
            var childRight = child.x + child.width;
            var childBottom = child.y + child.height;
            if (childRight > maxChildRight) maxChildRight = childRight;
            if (childBottom > maxChildBottom) maxChildBottom = childBottom;
        }

        // 부모가 자식보다 작으면 확장
        if (maxChildRight > node.width || maxChildBottom > node.height) {
            var newWidth = Math.max(node.width, maxChildRight);
            var newHeight = Math.max(node.height, maxChildBottom);
            try {
                node.resize(newWidth, newHeight);
            } catch (resizeErr) { /* ignore resize errors */ }
        }
    }

    return node;
}

// 동적 컴포넌트 생성 함수
function createDynamicComponents(components, colors, font, styleMap, startX, startY) {
    var xPos = startX;
    var yPos = startY;
    var maxHeight = 0;

    // 트리 구조 감지 (첫 컴포넌트에 children이 있으면 트리 모드)
    var isTreeMode = components.length > 0 && components[0].children !== undefined;

    if (isTreeMode) {
        // 트리 구조: 재귀적으로 노드 생성
        console.log("트리 구조 모드: 재귀적 노드 생성");
        for (var t = 0; t < components.length; t++) {
            var rootNode = createTreeNode(components[t], null, colors, font, startX, startY);
            figma.currentPage.appendChild(rootNode);
        }
        return;
    }

    // 기존 플랫 구조 처리
    var isAbsoluteMode = components.length > 0 && components[0].layout === 'absolute';

    for (var i = 0; i < components.length; i++) {
        var comp = components[i];

        // absolute 모드: Frame 사용 (컴포넌트 대신)
        var component;
        if (isAbsoluteMode) {
            component = figma.createFrame();
        } else {
            component = figma.createComponent();
        }
        component.name = comp.name;

        // 레이아웃 설정
        if (comp.layout === "horizontal") {
            component.layoutMode = "HORIZONTAL";
            component.primaryAxisAlignItems = "CENTER";
            component.counterAxisAlignItems = "CENTER";
        } else if (comp.layout === "vertical") {
            component.layoutMode = "VERTICAL";
            component.primaryAxisAlignItems = "CENTER";
            component.counterAxisAlignItems = "CENTER";
        } else if (comp.layout === "absolute") {
            // 절대 좌표 모드 - 레이아웃 없이 위치만 설정
            component.layoutMode = "NONE";
        } else {
            component.primaryAxisAlignItems = "CENTER";
            component.counterAxisAlignItems = "CENTER";
        }

        // 크기 설정
        if (comp.type === "avatar" && comp.size) {
            component.resize(comp.size, comp.size);
        } else {
            var w = comp.width === "hug" ? 1 : (comp.width || 120);
            var h = comp.height === "hug" ? 1 : (comp.height || 40);
            component.resize(w, h);
            if (comp.width === "hug") component.layoutSizingHorizontal = "HUG";
            if (comp.height === "hug") component.layoutSizingVertical = "HUG";
        }

        // 패딩
        if (comp.padding) {
            component.paddingLeft = comp.padding.x || 0;
            component.paddingRight = comp.padding.x || 0;
            component.paddingTop = comp.padding.y || 0;
            component.paddingBottom = comp.padding.y || 0;
        }

        // 모서리
        if (comp.cornerRadius !== undefined) {
            if (typeof comp.cornerRadius === "object") {
                // 개별 모서리 값
                component.topLeftRadius = comp.cornerRadius.topLeft || 0;
                component.topRightRadius = comp.cornerRadius.topRight || 0;
                component.bottomRightRadius = comp.cornerRadius.bottomRight || 0;
                component.bottomLeftRadius = comp.cornerRadius.bottomLeft || 0;
            } else {
                component.cornerRadius = comp.cornerRadius;
            }
        }

        // 배경색 (transparent/null이면 투명하게)
        if (comp.background && comp.background !== "transparent" && comp.background !== null) {
            var bgColor = getColorValue(comp.background, colors);
            if (bgColor && bgColor !== "transparent") {
                component.fills = [{ type: "SOLID", color: hexToRgb(bgColor) }];
            } else {
                component.fills = [];  // 투명
            }
        } else {
            component.fills = [];  // 투명
        }

        // 테두리: 실제 border 정보가 있는 경우에만 적용
        if (comp.border && comp.border.color && comp.border.width > 0) {
            var borderColor = getColorValue(comp.border.color, colors);
            if (borderColor && borderColor.startsWith("#")) {
                component.strokes = [{ type: "SOLID", color: hexToRgb(borderColor) }];
                component.strokeWeight = comp.border.width;
                component.strokeAlign = "INSIDE";
            }
        }

        // opacity 적용
        if (comp.opacity !== undefined && comp.opacity < 1) {
            component.opacity = comp.opacity;
        }

        // box-shadow 적용
        if (comp.shadow && comp.shadow.color) {
            var shadowColor = comp.shadow.color;
            var shadowRgb = hexToRgb(shadowColor);
            component.effects = [{
                type: "DROP_SHADOW",
                color: { r: shadowRgb.r, g: shadowRgb.g, b: shadowRgb.b, a: 0.25 },
                offset: { x: comp.shadow.x || 0, y: comp.shadow.y || 4 },
                radius: comp.shadow.blur || 8,
                visible: true,
                blendMode: "NORMAL"
            }];
        }

        // gradient 배경 적용
        if (comp.gradient) {
            try {
                // rgb() 색상을 hex로 변환하는 헬퍼
                function rgbStringToHex(rgbStr) {
                    var match = rgbStr.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
                    if (match) {
                        var r = parseInt(match[1]);
                        var g = parseInt(match[2]);
                        var b = parseInt(match[3]);
                        return "#" + [r, g, b].map(function (x) {
                            return (x < 16 ? "0" : "") + x.toString(16);
                        }).join("");
                    }
                    return null;
                }

                // linear-gradient에서 색상 추출
                var colors = comp.gradient.match(/rgb\([^)]+\)|#[0-9a-fA-F]{6}/g);
                if (colors && colors.length >= 2) {
                    var hexColor1 = colors[0].startsWith("#") ? colors[0] : rgbStringToHex(colors[0]);
                    var hexColor2 = colors[1].startsWith("#") ? colors[1] : rgbStringToHex(colors[1]);
                    if (hexColor1 && hexColor2) {
                        component.fills = [{
                            type: "GRADIENT_LINEAR",
                            gradientTransform: [[1, 0, 0], [0, 1, 0]],
                            gradientStops: [
                                { position: 0, color: Object.assign({}, hexToRgb(hexColor1), { a: 1 }) },
                                { position: 1, color: Object.assign({}, hexToRgb(hexColor2), { a: 1 }) }
                            ]
                        }];
                    }
                }
            } catch (gradErr) {
                console.log("Gradient 파싱 실패:", gradErr.message);
            }
        }

        // 텍스트 추가
        if (comp.text) {
            // 모든 텍스트 포함 요소에 auto layout 적용
            component.layoutMode = "HORIZONTAL";
            component.counterAxisAlignItems = "CENTER";  // 수직 중앙

            if (comp.type === "button") {
                // 버튼은 수평도 중앙 + HUG + padding
                component.primaryAxisAlignItems = "CENTER";
                component.layoutSizingHorizontal = "HUG";
                component.layoutSizingVertical = "HUG";
                component.paddingLeft = 8;
                component.paddingRight = 8;
                component.paddingTop = 4;
                component.paddingBottom = 4;
            } else {
                // 텍스트는 왼쪽 정렬 + 고정 크기
                component.primaryAxisAlignItems = "MIN";
                component.layoutSizingHorizontal = "FIXED";
                component.layoutSizingVertical = "FIXED";
                component.clipsContent = true;
            }

            var textNode = figma.createText();
            var fontStyle = font.regular;
            if (comp.text.fontWeight >= 600) fontStyle = font.semibold;
            else if (comp.text.fontWeight >= 500) fontStyle = font.medium;

            textNode.fontName = { family: font.name, style: fontStyle };
            textNode.characters = comp.text.content || "Text";
            textNode.fontSize = comp.text.fontSize || 14;
            textNode.textAutoResize = "WIDTH_AND_HEIGHT";

            // 버튼 타입이고 배경색이 있으면 텍스트를 흰색으로
            var textColor;
            if (comp.type === "button" && comp.background) {
                textColor = "#FFFFFF";  // 버튼 텍스트는 흰색
            } else {
                textColor = getColorValue(comp.text.color, colors);
            }
            textNode.fills = [{ type: "SOLID", color: hexToRgb(textColor) }];

            component.appendChild(textNode);
        }

        // 아이콘 타입이면 placeholder 생성
        if (comp.type === "icon") {
            component.fills = [{ type: "SOLID", color: { r: 0.4, g: 0.4, b: 1 } }];  // 파란색 placeholder
            component.cornerRadius = Math.min(comp.width || 24, comp.height || 24) / 4;
            // 아이콘 라벨 추가
            var iconLabel = figma.createText();
            iconLabel.fontName = { family: font.name, style: font.regular };
            iconLabel.characters = "★";  // 별 아이콘 placeholder
            iconLabel.fontSize = Math.min(comp.width || 24, comp.height || 24) * 0.6;
            iconLabel.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }];
            component.appendChild(iconLabel);
        }

        // 자식 요소 (Card 등 여러 텍스트)
        if (comp.children && comp.children.length > 0) {
            component.itemSpacing = 0;
            for (var j = 0; j < comp.children.length; j++) {
                var child = comp.children[j];

                if (child.type === "header") {
                    // 헤더 영역 (프로필, 날짜 등)
                    var header = figma.createFrame();
                    header.name = "Header";
                    header.layoutMode = "HORIZONTAL";
                    header.counterAxisAlignItems = "CENTER";
                    header.resize(component.width - 32, child.height || 48);
                    header.fills = [];
                    header.itemSpacing = 8;
                    header.paddingLeft = 16;
                    header.paddingRight = 16;
                    header.paddingTop = 12;
                    header.paddingBottom = 12;

                    // 아바타
                    var avatar = figma.createEllipse();
                    avatar.name = "Avatar";
                    avatar.resize(32, 32);
                    avatar.fills = [{ type: "SOLID", color: { r: 0.8, g: 0.8, b: 0.8 } }];
                    header.appendChild(avatar);

                    // 유저명 + 날짜 컨테이너
                    var userInfo = figma.createFrame();
                    userInfo.name = "UserInfo";
                    userInfo.layoutMode = "VERTICAL";
                    userInfo.fills = [];
                    userInfo.layoutGrow = 1;
                    userInfo.itemSpacing = 2;

                    var username = figma.createText();
                    username.fontName = { family: font.name, style: font.medium };
                    username.characters = "Username";
                    username.fontSize = 14;
                    username.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.1 } }];
                    userInfo.appendChild(username);

                    var date = figma.createText();
                    date.fontName = { family: font.name, style: font.regular };
                    date.characters = "2일 전";
                    date.fontSize = 12;
                    date.fills = [{ type: "SOLID", color: { r: 0.5, g: 0.5, b: 0.5 } }];
                    userInfo.appendChild(date);

                    header.appendChild(userInfo);
                    component.appendChild(header);

                } else if (child.type === "image") {
                    // 이미지 영역
                    var imgFrame = figma.createFrame();
                    imgFrame.name = "Image";
                    imgFrame.resize(child.width || component.width, child.height || 200);
                    imgFrame.fills = [{ type: "SOLID", color: { r: 0.93, g: 0.93, b: 0.93 } }];
                    imgFrame.layoutMode = "VERTICAL";
                    imgFrame.primaryAxisAlignItems = "CENTER";
                    imgFrame.counterAxisAlignItems = "CENTER";

                    // X 표시 (텍스트)
                    var xText = figma.createText();
                    xText.fontName = { family: font.name, style: font.regular };
                    xText.characters = "✕";
                    xText.fontSize = Math.min(imgFrame.width, imgFrame.height) * 0.3;
                    xText.fills = [{ type: "SOLID", color: { r: 0.7, g: 0.7, b: 0.7 } }];
                    imgFrame.appendChild(xText);

                    component.appendChild(imgFrame);

                } else if (child.type === "footer") {
                    // 푸터 영역 (좋아요, 댓글, 공유)
                    var footer = figma.createFrame();
                    footer.name = "Footer";
                    footer.layoutMode = "HORIZONTAL";
                    footer.counterAxisAlignItems = "CENTER";
                    footer.resize(component.width - 32, child.height || 44);
                    footer.fills = [];
                    footer.itemSpacing = 16;
                    footer.paddingLeft = 16;
                    footer.paddingRight = 16;
                    footer.paddingTop = 10;
                    footer.paddingBottom = 10;

                    // 좋아요
                    var likeBtn = figma.createText();
                    likeBtn.fontName = { family: font.name, style: font.regular };
                    likeBtn.characters = "♡ 123";
                    likeBtn.fontSize = 14;
                    likeBtn.fills = [{ type: "SOLID", color: { r: 0.4, g: 0.4, b: 0.4 } }];
                    footer.appendChild(likeBtn);

                    // 댓글
                    var commentBtn = figma.createText();
                    commentBtn.fontName = { family: font.name, style: font.regular };
                    commentBtn.characters = "💬 45";
                    commentBtn.fontSize = 14;
                    commentBtn.fills = [{ type: "SOLID", color: { r: 0.4, g: 0.4, b: 0.4 } }];
                    footer.appendChild(commentBtn);

                    // 공유
                    var shareBtn = figma.createText();
                    shareBtn.fontName = { family: font.name, style: font.regular };
                    shareBtn.characters = "↗";
                    shareBtn.fontSize = 14;
                    shareBtn.fills = [{ type: "SOLID", color: { r: 0.4, g: 0.4, b: 0.4 } }];
                    footer.appendChild(shareBtn);

                    component.appendChild(footer);

                } else if (child.type === "text") {
                    var childText = figma.createText();
                    var childStyle = font.regular;
                    if (child.fontWeight >= 600) childStyle = font.semibold;
                    else if (child.fontWeight >= 500) childStyle = font.medium;

                    childText.fontName = { family: font.name, style: childStyle };
                    childText.characters = child.content || "Text";
                    childText.fontSize = child.fontSize || 14;

                    var childColor = getColorValue(child.color, colors);
                    childText.fills = [{ type: "SOLID", color: hexToRgb(childColor) }];

                    component.appendChild(childText);
                }
            }
        }

        // 위치 설정
        if (isAbsoluteMode && comp.x !== undefined && comp.y !== undefined) {
            // absolute 모드: JSON의 x, y 좌표 직접 사용
            component.x = comp.x;
            component.y = comp.y;
        } else {
            // 일반 모드: 그리드 배치
            component.x = xPos;
            component.y = yPos;

            xPos += component.width + 20;
            if (component.height > maxHeight) maxHeight = component.height;

            // 4개마다 줄바꿈
            if ((i + 1) % 4 === 0) {
                xPos = startX;
                yPos += maxHeight + 30;
                maxHeight = 0;
            }
        }
    }

    console.log("동적 컴포넌트 " + components.length + "개 생성 완료");
    return true;
}

function loadPretendard() {
    return figma.loadFontAsync({ family: "Pretendard", style: "Regular" })
        .then(function () { return figma.loadFontAsync({ family: "Pretendard", style: "Medium" }); })
        .then(function () { return figma.loadFontAsync({ family: "Pretendard", style: "SemiBold" }); })
        .then(function () { return figma.loadFontAsync({ family: "Pretendard", style: "Bold" }); });
}

function parseTokenFiles(files) {
    var result = { colors: {}, typography: {}, spacing: {}, borderRadius: {}, components: [] };

    for (var name in files) {
        var data = files[name];

        // colors.json
        if (name.indexOf('color') !== -1) {
            if (data.colors) result.colors = Object.assign(result.colors, data.colors);
            if (data.primary) result.colors.primary = data.primary;
            if (data.status) result.colors.status = data.status;
        }

        // typography.json
        if (name.indexOf('typo') !== -1) {
            if (data.typography) {
                if (data.typography.fontFamily) {
                    // 시스템 폰트 → Figma 호환 폰트로 매핑
                    result.fontFamily = {
                        sans: mapFontFamily(data.typography.fontFamily.sans || data.typography.fontFamily)
                    };
                }
                // 직접 키-값 형태 (h1, b1 등)
                for (var key in data.typography) {
                    if (key !== 'fontFamily') {
                        var item = data.typography[key];
                        if (item.fontSize) {
                            result.typography[key] = {
                                fontSize: parseInt(item.fontSize),
                                lineHeight: parseInt(item.lineHeight),
                                fontWeight: parseInt(item.fontWeight || 500)
                            };
                        }
                    }
                }
            }
        }

        // sizing.json (spacing + borderRadius 통합)
        if (name.indexOf('sizing') !== -1) {
            if (data.spacing) result.spacing = data.spacing;
            if (data.borderRadius) result.borderRadius = data.borderRadius;
        }

        // spacing.json
        if (name.indexOf('spacing') !== -1 && data.spacing) {
            result.spacing = data.spacing;
        }

        // radius.json
        if (name.indexOf('radius') !== -1 && data.borderRadius) {
            result.borderRadius = data.borderRadius;
        }

        // components.json
        if (name.indexOf('component') !== -1 && data.components) {
            result.components = data.components;
        }
    }

    return result;
}

// 색상 참조 해석 (예: "primary.500" → 실제 hex 값)
function getColorValue(colorRef, colors) {
    if (!colorRef) return "#888888";
    if (colorRef.startsWith("#")) return colorRef;

    var parts = colorRef.split(".");
    var current = colors;
    for (var i = 0; i < parts.length; i++) {
        current = current[parts[i]];
        if (!current) return "#888888";
    }
    return current;
}

function mergeTokens(base, imported) {
    return {
        colors: Object.assign({}, base.colors, imported.colors),
        typography: Object.assign({}, base.typography, imported.typography),
        spacing: Object.assign({}, base.spacing, imported.spacing),
        borderRadius: Object.assign({}, base.borderRadius, imported.borderRadius),
        breakpoints: base.breakpoints,
        components: imported.components && imported.components.length > 0 ? imported.components : [],
        fontFamily: imported.fontFamily || base.fontFamily
    };
}

function createVariablesFromTokens(t) {
    try {
        var c = t.colors || {};

        // Colors
        var colorCollection = figma.variables.createVariableCollection("Imported Colors");
        if (c.primary) {
            var keys = Object.keys(c.primary);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                figma.variables.createVariable("primary/" + key, colorCollection, "COLOR")
                    .setValueForMode(colorCollection.defaultModeId, hexToRgb(c.primary[key]));
            }
        }
        if (c.status) {
            var keys = Object.keys(c.status);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                figma.variables.createVariable("status/" + key, colorCollection, "COLOR")
                    .setValueForMode(colorCollection.defaultModeId, hexToRgb(c.status[key]));
            }
        }

        // Spacing
        if (t.spacing && Object.keys(t.spacing).length > 0) {
            var spacingCollection = figma.variables.createVariableCollection("Imported Spacing");
            var keys = Object.keys(t.spacing);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                figma.variables.createVariable("spacing/" + key, spacingCollection, "FLOAT")
                    .setValueForMode(spacingCollection.defaultModeId, t.spacing[key]);
            }
        }

        // Border Radius
        if (t.borderRadius && Object.keys(t.borderRadius).length > 0) {
            var radiusCollection = figma.variables.createVariableCollection("Imported Radius");
            var keys = Object.keys(t.borderRadius);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                figma.variables.createVariable("radius/" + key, radiusCollection, "FLOAT")
                    .setValueForMode(radiusCollection.defaultModeId, t.borderRadius[key]);
            }
        }

        // Typography
        if (t.typography && Object.keys(t.typography).length > 0) {
            var typoCollection = figma.variables.createVariableCollection("Imported Typography");
            if (t.fontFamily) {
                figma.variables.createVariable("fontFamily/sans", typoCollection, "STRING")
                    .setValueForMode(typoCollection.defaultModeId, t.fontFamily.sans || "Inter");
            }
            var keys = Object.keys(t.typography);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var typo = t.typography[key];
                if (typo.fontSize) {
                    figma.variables.createVariable("typo/" + key + "/fontSize", typoCollection, "FLOAT")
                        .setValueForMode(typoCollection.defaultModeId, typo.fontSize);
                }
                if (typo.lineHeight) {
                    figma.variables.createVariable("typo/" + key + "/lineHeight", typoCollection, "FLOAT")
                        .setValueForMode(typoCollection.defaultModeId, typo.lineHeight);
                }
                if (typo.fontWeight) {
                    figma.variables.createVariable("typo/" + key + "/fontWeight", typoCollection, "FLOAT")
                        .setValueForMode(typoCollection.defaultModeId, typo.fontWeight);
                }
            }
        }

        console.log("Imported Variables 생성 완료");
        return true;
    } catch (err) {
        console.error("Variables 에러:", err);
        return false;
    }
}

function createTextStylesFromTokens(t, font) {
    var styleMap = {};
    var typoMap = t.typography || {};
    var keys = Object.keys(typoMap);

    if (keys.length === 0) {
        console.log("Typography 토큰 없음, 기본 스타일 생성");
        return createTextStyles(font);
    }

    for (var i = 0; i < keys.length; i++) {
        var name = keys[i];
        var typo = typoMap[name];

        // 폰트 스타일 결정
        var fontStyle = font.regular;
        if (typo.fontWeight >= 700) fontStyle = font.bold;
        else if (typo.fontWeight >= 600) fontStyle = font.semibold;
        else if (typo.fontWeight >= 500) fontStyle = font.medium;

        try {
            var style = figma.createTextStyle();
            style.name = "typo-" + name;
            style.fontName = { family: font.name, style: fontStyle };
            style.fontSize = typo.fontSize || 14;
            style.lineHeight = { value: typo.lineHeight || typo.fontSize * 1.5, unit: "PIXELS" };
            styleMap[name] = style;
        } catch (err) {
            console.log("스타일 생성 실패 (스킵):", name, err.message);
        }
    }

    console.log("Imported Text Styles 생성 완료:", Object.keys(styleMap).length + "개");
    return styleMap;
}

// 메인 실행
function main() {
    var command = figma.command;
    console.log("Design Tokens Plugin - Command:", command);

    if (command === "import-ui") {
        // UI 열기
        figma.showUI(__html__, { width: 320, height: 480 });
        return; // UI 닫힐 때까지 대기
    }

    if (command === "export-ui") {
        // Export UI 열기 (동일 UI, Export 섹션으로 스크롤)
        figma.showUI(__html__, { width: 320, height: 560 });
        // UI에 export 모드 알림
        figma.ui.postMessage({ type: 'focus-export' });
        return;
    }

    if (command === "create-variables") {
        createVariables();
        figma.notify("✅ Variables 생성 완료!");
        figma.closePlugin();
    } else if (command === "create-text-styles") {
        loadFonts().then(function (font) {
            return loadPretendard().then(function () { return font; }).catch(function () { return font; });
        }).then(function (font) {
            var styleMap = createTextStyles(font);
            figma.notify("✅ Text Styles " + Object.keys(styleMap).length + "개 생성 완료!");
            figma.closePlugin();
        }).catch(function (err) {
            console.error(err);
            figma.notify("❌ 폰트 로드 실패");
            figma.closePlugin();
        });
    } else if (command === "create-components") {
        loadFonts().then(function (font) {
            createComponents(font, {});
            figma.notify("✅ 컴포넌트 생성 완료! (폰트: " + font.name + ")");
            figma.closePlugin();
        }).catch(function (err) {
            console.error(err);
            figma.notify("❌ 폰트 로드 실패");
            figma.closePlugin();
        });
    } else {
        // create-all: Variables + Text Styles + Components
        var ok = createVariables();
        if (ok) figma.notify("✅ Variables 생성 완료! Text Styles 생성 중...");
        loadFonts().then(function (font) {
            return loadPretendard().then(function () { return font; }).catch(function () { return font; });
        }).then(function (font) {
            var styleMap = createTextStyles(font);
            figma.notify("✅ Text Styles " + Object.keys(styleMap).length + "개 생성! 컴포넌트 생성 중...");
            createComponents(font, styleMap);
            figma.notify("✅ 전체 생성 완료!");
            figma.closePlugin();
        }).catch(function (err) {
            console.error(err);
            figma.notify("❌ 폰트 로드 실패");
            figma.closePlugin();
        });
    }
}

main();
