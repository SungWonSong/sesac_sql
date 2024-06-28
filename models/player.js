// player 모델 정의

const PlayerModel = (sequelize, DataTypes) => {
    // sequelize 매개변수 : models/index.js에서의 sequelize(db연결 정보를 입력하여 생성한 객체)
    // DataTypes 매개변수 : models/index.js에서의 sequelize (sequelize 패키지 자체)
    const Player = sequelize.define(
        // param1 : 모델 이름 설정
        'Player',
        
        // param2 : 모델 컬럼 정의
    
        {
        player_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(63),
            allowNull: false,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },

    // param3 : 모델 옵션 정의
    {
        freezeTableName: true, // 테이블 명 고정
        // timestamps : false, // 데이터가 추가되고 수정된 시간을 자동으로 컬럼을 만들어서 기록
    });

    return Player;
}

module.exports = PlayerModel;