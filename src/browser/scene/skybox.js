import {
    TextureLoader,
    MeshBasicMaterial,
    SphereGeometry,
    Mesh,
    BackSide
} from 'THREE';

export const init_skybox = sys => {

    new TextureLoader().load('assets/space.jpg', (tex) => {

        var material = new MeshBasicMaterial({map: tex, side: BackSide});
        var geometry = new SphereGeometry(25, 25, 25);
        var mesh = new Mesh(geometry, material);

        sys.visuals.animatable.push({
            animate_tick: scene => {
                scene.add(mesh);
            }
        });

    });

}
