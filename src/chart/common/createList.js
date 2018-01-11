import echarts from 'echarts/lib/echarts';

export default function (seriesModel, dims) {
    var source = seriesModel.getSource();


    var coordSysDimensions = dims || echarts.getCoordinateSystemDimensions(seriesModel.get('coordinateSystem')) || ['x', 'y', 'z'];

    var dimensions = echarts.helper.createDimensions(source, {
        coordDimensions: coordSysDimensions.map(function (dim) {
            var axis3DModel = seriesModel.getReferringComponents(dim + 'Axis3D')[0];
            return {
                type: axis3DModel.get('type') === 'category' ? 'ordinal' : 'float',
                name: dim,
                // Find stackable dimension. Which will represent value.
                stackable: dim === 'z'
            };
        })
    });
    if (seriesModel.get('coordinateSystem') === 'cartesian3D') {
        dimensions.forEach(function (dimInfo) {
            if (coordSysDimensions.indexOf(dimInfo.coordDim) >= 0) {
                var axis3DModel = seriesModel.getReferringComponents(dimInfo.coordDim + 'Axis3D')[0];
                if (axis3DModel && axis3DModel.get('type') === 'category') {
                    dimInfo.ordinalMeta = axis3DModel.getOrdinalMeta();
                }
            }
        });
    }

    var data = new echarts.List(dimensions, seriesModel);
    data.initData(source);

    return data;
}