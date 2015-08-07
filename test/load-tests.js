;(function(doc, global){
    var specPath = './spec/',
        dependencies = [
            'LayerGenerator.test.js',
            'StyleGenerator.test.js',
            'VectorLayerModifier.test.js'
        ],
        getScriptTag = global.TestUtil.getExternalScriptTag,
        dependencyCnt = dependencies.length,
        i = 0;

        for(; i < dependencyCnt; i++) {
            doc.write(getScriptTag(specPath + dependencies[i]));
        }
})(document, this);
