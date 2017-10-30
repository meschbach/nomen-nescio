import {JSONLoader, Mesh} from 'THREE';

export const init_ship = sys => {

    new JSONLoader().load('./assets/ship.json', (geometry, materials) => {

        var mesh = new Mesh(geometry, materials);
        mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.5;
        mesh.translation = geometry.center();

        sys.attach({
            animate_tick: scene => {
                mesh.rotation.y += 0.01;
                scene.add(mesh);
            }
        });

    });

}
