import React from 'react';
import { IGalaxy } from '../../models';
import SEButton from '../SEButton/SEButton';

import styles from './OreMap.module.css';

interface IOreMapProps {
    galaxy: IGalaxy;
    onClose: () => void;
}

interface IMap {
    [name: string]: string;
}

const OreMap: React.FC<IOreMapProps> = (props) => {

    const customOreOrder = [
        "Ice",
        "Iron",
        "Nickel",
        "Silicon",
        "Magnesium",
        "Cobalt",
        "Silver",
        "Gold",
        "Platinum",
        "Uraninite",
        "Trinium",
        "Naquadah",
        "Neutronium",
        "Olesian"
    ];

    const renameMap: IMap = {
        "Iron" : "Fe",
        "Nickel": "Ni",
        "Silicon": "Si",
        "Magnesium": "Mg",
        "Cobalt": "Co",
        "Silver": "Ag",
        "Gold": "Au",
        "Platinum": "Pt",
        "Uraninite": "U"
    }

    let celestialBodies: string[] = [];
    props.galaxy.index.forEach(indexEntry => {
        indexEntry.hierarchy.forEach(section => {
            celestialBodies.push(section.planet);
            celestialBodies = celestialBodies.concat(section.moons);
        })
    });

    const hasOre = (bodyName: string, oreName: string) => {
        const foundBody = props.galaxy.definitions.find(definition => definition.id === bodyName);
        if (!foundBody || !foundBody.ores.includes(oreName)) {
            return <></>;
        }
        return <span>+</span>;
    }

    const renderRow = (bodyName: string, oreOrder: string[]) => {
        return <tr key={bodyName}>
            <td>{bodyName}</td>
            {oreOrder.map(ore => <td className={styles.center} key={`${bodyName}-${ore}`}>{hasOre(bodyName, ore)}</td>)}
        </tr>;
    }

    return <div className={styles.wrapper}>
        <h1>Stargate Dimensions ore map</h1>
        <table>
            <thead>
                <tr>
                    <th>Planet/moon name</th>
                    {customOreOrder.map(ore => <th className={styles.oreheader} key={ore}>{renameMap[ore] ?? ore}</th>)}
                </tr>
            </thead>
            <tbody>
                {celestialBodies.map(body => renderRow(body, customOreOrder))}
            </tbody>
        </table>
        <div className={styles.button}>
            <SEButton label="Close" onClick={props.onClose} />
        </div>
    </div>;
}

export default OreMap;
