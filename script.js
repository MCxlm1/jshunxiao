document.addEventListener('DOMContentLoaded', () => {
    const inputArea = document.getElementById('input');
    const outputArea = document.getElementById('output');
    const obfuscateBtn = document.getElementById('obfuscateBtn');
    const copyBtn = document.getElementById('copyBtn');
    
    // 混淆选项复选框
    const stringArrayCheck = document.getElementById('stringArray');
    const deadCodeCheck = document.getElementById('deadCodeInjection');
    const controlFlowCheck = document.getElementById('controlFlowFlattening');

    // 获取所有新增的设置项元素
    const numbersToExpressionsCheck = document.getElementById('numbersToExpressions');
    const simplifyCheck = document.getElementById('simplify');
    const splitStringsCheck = document.getElementById('splitStrings');
    const stringArrayEncodingSelect = document.getElementById('stringArrayEncoding');
    const stringArrayThresholdInput = document.getElementById('stringArrayThreshold');
    const stringArrayThresholdValue = document.getElementById('stringArrayThresholdValue');
    const deadCodeInjectionThresholdInput = document.getElementById('deadCodeInjectionThreshold');
    const deadCodeInjectionThresholdValue = document.getElementById('deadCodeInjectionThresholdValue');
    const controlFlowFlatteningThresholdInput = document.getElementById('controlFlowFlatteningThreshold');
    const controlFlowFlatteningThresholdValue = document.getElementById('controlFlowFlatteningThresholdValue');
    const identifierNamesGeneratorSelect = document.getElementById('identifierNamesGenerator');
    const renameGlobalsCheck = document.getElementById('renameGlobals');
    const renamePropertiesCheck = document.getElementById('renameProperties');

    // 更新滑块值显示
    const updateRangeValue = (input, valueSpan) => {
        valueSpan.textContent = input.value;
    };

    // 为所有滑块添加事件监听
    [
        [stringArrayThresholdInput, stringArrayThresholdValue],
        [deadCodeInjectionThresholdInput, deadCodeInjectionThresholdValue],
        [controlFlowFlatteningThresholdInput, controlFlowFlatteningThresholdValue]
    ].forEach(([input, valueSpan]) => {
        input.addEventListener('input', () => updateRangeValue(input, valueSpan));
    });

    // 混淆预设配置
    const presets = {
        'default': {
            compact: true,
            controlFlowFlattening: false,
            deadCodeInjection: false,
            debugProtection: false,
            debugProtectionInterval: 0,
            disableConsoleOutput: false,
            identifierNamesGenerator: 'hexadecimal',
            numbersToExpressions: false,
            renameGlobals: false,
            selfDefending: false,
            simplify: true,
            splitStrings: false,
            stringArray: true,
            stringArrayCallsTransform: false,
            stringArrayCallsTransformThreshold: 0.5,
            stringArrayEncoding: [],
            stringArrayIndexShift: true,
            stringArrayRotate: true,
            stringArrayShuffle: true,
            stringArrayWrappersCount: 1,
            stringArrayWrappersChainedCalls: true,
            stringArrayWrappersParametersMaxCount: 2,
            stringArrayWrappersType: 'variable',
            stringArrayThreshold: 0.75,
            unicodeEscapeSequence: false
        },
        'low-obfuscation': {
            compact: true,
            controlFlowFlattening: false,
            deadCodeInjection: false,
            debugProtection: false,
            debugProtectionInterval: 0,
            disableConsoleOutput: true,
            identifierNamesGenerator: 'hexadecimal',
            numbersToExpressions: false,
            renameGlobals: false,
            selfDefending: true,
            simplify: true,
            splitStrings: false,
            stringArray: true,
            stringArrayCallsTransform: false,
            stringArrayEncoding: [],
            stringArrayIndexShift: true,
            stringArrayRotate: true,
            stringArrayShuffle: true,
            stringArrayWrappersCount: 1,
            stringArrayWrappersChainedCalls: true,
            stringArrayWrappersParametersMaxCount: 2,
            stringArrayWrappersType: 'variable',
            stringArrayThreshold: 0.75,
            unicodeEscapeSequence: false
        },
        'medium-obfuscation': {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.75,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.4,
            debugProtection: false,
            debugProtectionInterval: 0,
            disableConsoleOutput: true,
            identifierNamesGenerator: 'hexadecimal',
            numbersToExpressions: true,
            renameGlobals: false,
            selfDefending: true,
            simplify: true,
            splitStrings: true,
            splitStringsChunkLength: 10,
            stringArray: true,
            stringArrayCallsTransform: true,
            stringArrayCallsTransformThreshold: 0.75,
            stringArrayEncoding: ['base64'],
            stringArrayIndexShift: true,
            stringArrayRotate: true,
            stringArrayShuffle: true,
            stringArrayWrappersCount: 2,
            stringArrayWrappersChainedCalls: true,
            stringArrayWrappersParametersMaxCount: 4,
            stringArrayWrappersType: 'function',
            stringArrayThreshold: 0.75,
            transformObjectKeys: true,
            unicodeEscapeSequence: false
        },
        'high-obfuscation': {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 1,
            debugProtection: true,
            debugProtectionInterval: 4000,
            disableConsoleOutput: true,
            identifierNamesGenerator: 'hexadecimal',
            numbersToExpressions: true,
            renameGlobals: false,
            selfDefending: true,
            simplify: true,
            splitStrings: true,
            splitStringsChunkLength: 5,
            stringArray: true,
            stringArrayCallsTransform: true,
            stringArrayEncoding: ['rc4'],
            stringArrayIndexShift: true,
            stringArrayRotate: true,
            stringArrayShuffle: true,
            stringArrayWrappersCount: 5,
            stringArrayWrappersChainedCalls: true,
            stringArrayWrappersParametersMaxCount: 5,
            stringArrayWrappersType: 'function',
            stringArrayThreshold: 1,
            transformObjectKeys: true,
            unicodeEscapeSequence: false
        }
    };

    // 监听预设选择变化
    document.getElementById('optionsPreset').addEventListener('change', (e) => {
        const preset = presets[e.target.value];
        if (preset) {
            Object.entries(preset).forEach(([key, value]) => {
                const element = document.getElementById(key);
                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = value;
                    } else if (element.type === 'number' || element.type === 'range') {
                        element.value = value;
                        const valueDisplay = document.getElementById(`${key}Value`);
                        if (valueDisplay) {
                            valueDisplay.textContent = value;
                        }
                    } else if (element.type === 'select-one') {
                        if (key === 'stringArrayEncoding') {
                            element.value = Array.isArray(value) && value.length > 0 ? value[0] : 'none';
                        } else {
                            element.value = value;
                        }
                    } else {
                        element.value = value;
                    }
                }
            });
        }
    });

    obfuscateBtn.addEventListener('click', () => {
        const code = inputArea.value;
        if (!code.trim()) {
            alert('请输入要混淆的代码！');
            return;
        }

        try {
            const options = {
                // 基本设置
                optionsPreset: document.getElementById('optionsPreset').value,
                target: document.getElementById('target').value,
                seed: parseInt(document.getElementById('seed').value),
                compact: document.getElementById('compact').checked,
                simplify: document.getElementById('simplify').checked,

                // 字符串数组设置
                stringArray: document.getElementById('stringArray').checked,
                stringArrayRotate: document.getElementById('stringArrayRotate').checked,
                stringArrayShuffle: document.getElementById('stringArrayShuffle').checked,
                stringArrayCallsTransform: document.getElementById('stringArrayCallsTransform').checked,
                stringArrayCallsTransformThreshold: parseFloat(document.getElementById('stringArrayCallsTransformThreshold').value),
                stringArrayWrappersCount: parseInt(document.getElementById('stringArrayWrappersCount').value),
                stringArrayWrappersType: document.getElementById('stringArrayWrappersType').value,
                stringArrayThreshold: parseFloat(document.getElementById('stringArrayThreshold').value),
                stringArrayEncoding: document.getElementById('stringArrayEncoding').value !== 'none' ? 
                    [document.getElementById('stringArrayEncoding').value] : [],

                // 代码转换设置
                numbersToExpressions: document.getElementById('numbersToExpressions').checked,
                splitStrings: document.getElementById('splitStrings').checked,
                splitStringsChunkLength: parseInt(document.getElementById('splitStringsChunkLength').value),
                transformObjectKeys: document.getElementById('transformObjectKeys').checked,
                unicodeEscapeSequence: document.getElementById('unicodeEscapeSequence').checked,

                // 控制流设置
                controlFlowFlattening: document.getElementById('controlFlowFlattening').checked,
                controlFlowFlatteningThreshold: parseFloat(document.getElementById('controlFlowFlatteningThreshold').value),
                deadCodeInjection: document.getElementById('deadCodeInjection').checked,
                deadCodeInjectionThreshold: parseFloat(document.getElementById('deadCodeInjectionThreshold').value),

                // 标识符设置
                identifierNamesGenerator: document.getElementById('identifierNamesGenerator').value,
                identifiersPrefix: document.getElementById('identifiersPrefix').value,
                renameGlobals: document.getElementById('renameGlobals').checked,
                renameProperties: document.getElementById('renameProperties').checked,
                renamePropertiesMode: document.getElementById('renamePropertiesMode').value,

                // 调试保护设置
                debugProtection: document.getElementById('debugProtection').checked,
                debugProtectionInterval: parseInt(document.getElementById('debugProtectionInterval').value),
                disableConsoleOutput: document.getElementById('disableConsoleOutput').checked,
                selfDefending: document.getElementById('selfDefending').checked,

                // 域名锁定设置
                domainLock: document.getElementById('domainLock').value.split(',').filter(domain => domain.trim()),
                domainLockRedirectUrl: document.getElementById('domainLockRedirectUrl').value,

                // 其他设置
                sourceMap: false,
                sourceMapMode: 'separate',
                stringArrayIndexesType: ['hexadecimal-number'],
                stringArrayIndexShift: true,
                stringArrayWrappersParametersMaxCount: 2,
                stringArrayWrappersChainedCalls: true
            };

            const result = JavaScriptObfuscator.obfuscate(code, options);
            outputArea.value = result.getObfuscatedCode();
        } catch (error) {
            alert('混淆过程中发生错误：' + error.message);
            console.error(error);
        }
    });

    copyBtn.addEventListener('click', () => {
        outputArea.select();
        document.execCommand('copy');
        alert('已复制到剪贴板！');
    });

    // 添加示例代码
    inputArea.value = `function greeting(name) {
    console.log("Hello, " + name + "!");
    return "Welcome to our website!";
}`;
}); 