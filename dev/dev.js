const camelCase = require('camelcase');

const props = [
  {
    id: 'Assembled Height (in)',
    data_type: 'number',
    inherited: false,
    values: [
      {
        double: '149.56',
        name: '149.56',
        id: '149.56'
      }
    ]
  },
  {
    id: 'Assembled Length (in)',
    data_type: 'number',
    inherited: false,
    values: [
      {
        double: '87.18',
        name: '87.18',
        id: '87.18'
      }
    ]
  },
  {
    id: 'Assembled Width (in)',
    data_type: 'number',
    inherited: false,
    values: [
      {
        double: '70.68',
        name: '70.68',
        id: '70.68'
      }
    ]
  },
  {
    id: 'Assembly Required',
    data_type: 'boolean',
    inherited: false,
    values: [
      {
        name: 'Yes',
        id: 'true'
      }
    ]
  },
  {
    id: 'Brand',
    data_type: 'enumerated',
    inherited: false,
    values: [
      {
        id: 'Goalrilla',
        name: 'Goalrilla'
      }
    ]
  },
  {
    id: 'Brand Images',
    data_type: 'digital_asset',
    inherited: false,
    values: [
      {
        name: 'v7hae2dprbrltle4akgh.jpg',
        id: 'd58262a60aff07455f330f3934c499a14c82bf89',
        thumbnail_url:
          'https://images.salsify.com/image/upload/s--v1lMhq5X--/t_salsify_image_40/tejwrllcrpvpdqz5yd53.jpg',
        large_url:
          'https://images.salsify.com/image/upload/s--j2DhMRsn--/c_limit,cs_srgb,h_600,w_600/tejwrllcrpvpdqz5yd53.jpg',
        resource_type: 'image',
        in_progress: false,
        failed: false,
        failure_message: null
      }
    ]
  },
  {
    id: 'Brand Video',
    data_type: 'digital_asset',
    inherited: false,
    values: [
      {
        name: 'Dream Bigger Than Your Driveway - Ford Center.mp4',
        id: '70aa13686e1839c581f739ea527a95aa7cd5349e',
        thumbnail_url:
          'https://images.salsify.com/video/upload/s--Z6jXCVy1--/t_salsify_image_40/sggc1woxvetnnwqlroj9.jpg',
        large_url:
          'https://images.salsify.com/video/upload/s--nySSDb5C--/c_limit,h_600,w_600/sggc1woxvetnnwqlroj9.mp4',
        resource_type: 'video',
        in_progress: null,
        failed: false,
        failure_message: null
      }
    ]
  },
  {
    id: 'Brand Website',
    data_type: 'link',
    inherited: false,
    values: [
      {
        name: 'http://www.goalrilla.com/',
        id: 'http://www.goalrilla.com/'
      }
    ]
  },
  {
    id: 'Feature Bullets',
    data_type: 'string',
    inherited: false,
    values: [
      {
        name: '•72” x 42” Backboard with Aluminum Frame and 4’ Overhang',
        id: '•72” x 42” Backboard with Aluminum Frame and 4’ Overhang'
      },
      {
        name: '•Limited Lifetime Warranty Including Glass',
        id: '•Limited Lifetime Warranty Including Glass'
      }
    ]
  },
  {
    id: 'Item Name',
    data_type: 'string',
    inherited: false,
    values: [
      {
        name: 'GS I',
        id: 'GS I'
      }
    ]
  },
  {
    id: 'Item Number',
    data_type: 'string',
    inherited: false,
    values: [
      {
        name: 'B3100W',
        id: 'B3100W'
      }
    ]
  },
  {
    id: 'Long Description',
    data_type: 'string',
    inherited: false,
    values: [
      {
        name:
          'It\'s the Goalrilla basketball hoop that redefined what outdoor basketball systems should be. A massive 72" x 42" tempered glass backboard paired with a 6" x 6" one-piece steel pole. It was the first to make other adjustable basketball goals seem less than acceptable. All Goalrilla outdoor basketball hoops are built to be just that... outdoors. The classic GSI system is no exception. With its powder coated finish and corrosion-resistant hardware, it\'s ready for anything the elements – or you – can throw at it.',
        id:
          'It\'s the Goalrilla basketball hoop that redefined what outdoor basketball systems should be. A massive 72" x 42" tempered glass backboard paired with a 6" x 6" one-piece steel pole. It was the first to make other adjustable basketball goals seem less than acceptable. All Goalrilla outdoor basketball hoops are built to be just that... outdoors. The classic GSI system is no exception. With its powder coated finish and corrosion-resistant hardware, it\'s ready for anything the elements – or you – can throw at it.'
      }
    ]
  },
  {
    id: 'Main Image',
    data_type: 'digital_asset',
    inherited: false,
    values: [
      {
        name: 'B3100W_GSI_Main.jpg',
        id: '57926aa6c6710acc58b2aa6d1305400eedb1f846',
        thumbnail_url:
          'https://images.salsify.com/image/upload/s--Y98IJAtj--/t_salsify_image_40/vaza70adnwrqn6c3scke.jpg',
        large_url:
          'https://images.salsify.com/image/upload/s--1CPcH10F--/c_limit,cs_srgb,h_600,w_600/vaza70adnwrqn6c3scke.jpg',
        resource_type: 'image',
        in_progress: null,
        failed: false,
        failure_message: null
      }
    ]
  },
  {
    id: 'Manual',
    data_type: 'digital_asset',
    inherited: false,
    values: [
      {
        name: 'B3100W_Manual.pdf',
        id: '7058ceeffae4b9d0145f4e33656661c9de61a289',
        thumbnail_url:
          'https://images.salsify.com/image/upload/s--Xw0ejnjz--/t_salsify_image_40/ajnkfhokwevzvhbd3gin.jpg',
        large_url:
          'https://images.salsify.com/image/upload/s--j9QzUGrI--/c_limit,cs_srgb,h_600,w_600/ajnkfhokwevzvhbd3gin.jpg',
        resource_type: 'image',
        in_progress: null,
        failed: false,
        failure_message: null
      },
      {
        name: 'B3100W_B3111W_Manual.pdf',
        id: 'd5c529a83de94e923b5c56d637b5a03d11a55690',
        thumbnail_url:
          'https://images.salsify.com/image/upload/s--KlGrV5qh--/t_salsify_image_40/xxuybg8q6px1941ntznw.jpg',
        large_url:
          'https://images.salsify.com/image/upload/s--LoUSgEOn--/c_limit,cs_srgb,h_600,w_600/xxuybg8q6px1941ntznw.jpg',
        resource_type: 'image',
        in_progress: null,
        failed: false,
        failure_message: null
      },
      {
        name: '2L-7254-02 (B3100W & B3111W) .pdf',
        id: 'fffc74058fa15894ae1e51a1d3ed40ff36b3ffe1',
        thumbnail_url:
          'https://images.salsify.com/image/upload/s--_knpKtAy--/t_salsify_image_40/ml4oq0psdkwgkzylp7ir.jpg',
        large_url:
          'https://images.salsify.com/image/upload/s--8w_shx8i--/c_limit,cs_srgb,h_600,w_600/ml4oq0psdkwgkzylp7ir.jpg',
        resource_type: 'image',
        in_progress: null,
        failed: false,
        failure_message: null
      }
    ]
  },
  {
    id: 'Material',
    data_type: 'string',
    inherited: false,
    values: [
      {
        name: 'Steel and Glass',
        id: 'Steel and Glass'
      }
    ]
  },
  {
    id: 'Number of People Required for Assembly',
    data_type: 'number',
    inherited: false,
    values: [
      {
        double: '4',
        name: '4',
        id: '4'
      }
    ]
  },
  {
    id: 'Primary Color',
    data_type: 'string',
    inherited: false,
    values: [
      {
        name: 'Black',
        id: 'Black'
      }
    ]
  },
  {
    id: 'Product Name',
    data_type: 'string',
    inherited: false,
    values: [
      {
        name: 'Goalrilla GS I',
        id: 'Goalrilla GS I'
      }
    ]
  },
  {
    id: 'Product Title',
    data_type: 'string',
    inherited: false,
    values: [
      {
        name:
          'Goalrilla GS I In-Ground Basketball Systems with Tempered Glass Backboard',
        id:
          'Goalrilla GS I In-Ground Basketball Systems with Tempered Glass Backboard'
      }
    ]
  },
  {
    id: 'Product Type',
    data_type: 'enumerated',
    inherited: false,
    values: [
      {
        id: 'Basketball Goal - In Ground',
        name: 'Basketball Goal - In Ground'
      }
    ]
  },
  {
    id: 'Product Website',
    data_type: 'link',
    inherited: false,
    values: [
      {
        name: 'http://www.goalrilla.com/basketball-hoops/72in-backboard/gsi',
        id: 'http://www.goalrilla.com/basketball-hoops/72in-backboard/gsi'
      }
    ]
  },
  {
    id: 'Secondary Color',
    data_type: 'string',
    inherited: false,
    values: [
      {
        name: 'Silver',
        id: 'Silver'
      }
    ]
  },
  {
    id: 'Summary Bullets',
    data_type: 'string',
    inherited: false,
    values: [
      {
        name: 'Excellent Rebound with 3/8” Thick Tempered Glass Backboard',
        id: 'Excellent Rebound with 3/8” Thick Tempered Glass Backboard'
      },
      {
        name: 'Adjustable Goal Height from 7.5’ to 10’ with Crank Actuator',
        id: 'Adjustable Goal Height from 7.5’ to 10’ with Crank Actuator'
      },
      {
        name:
          'Included Anchor System Installs In-Ground and Allows Goal to be Moved',
        id:
          'Included Anchor System Installs In-Ground and Allows Goal to be Moved'
      },
      {
        name:
          'Pro-Style Breakaway Rim Flexes Under Pressure for Safety and Playability',
        id:
          'Pro-Style Breakaway Rim Flexes Under Pressure for Safety and Playability'
      },
      {
        name: '6”x6” Square Pole for Superior Strength',
        id: '6”x6” Square Pole for Superior Strength'
      }
    ]
  },
  {
    id: 'Web Images',
    data_type: 'digital_asset',
    inherited: false,
    values: [
      {
        name: 'B3100W_GSI_Main.jpg',
        id: '57926aa6c6710acc58b2aa6d1305400eedb1f846',
        thumbnail_url:
          'https://images.salsify.com/image/upload/s--Y98IJAtj--/t_salsify_image_40/vaza70adnwrqn6c3scke.jpg',
        large_url:
          'https://images.salsify.com/image/upload/s--1CPcH10F--/c_limit,cs_srgb,h_600,w_600/vaza70adnwrqn6c3scke.jpg',
        resource_type: 'image',
        in_progress: null,
        failed: false,
        failure_message: null
      },
      {
        name: 'B3100W_GSI_Backboard_Dark_Background.jpg',
        id: '1ec914bb0c648f05eb3e89ae486d06c9639931d4',
        thumbnail_url:
          'https://images.salsify.com/image/upload/s--G_ceTdNY--/t_salsify_image_40/qrsmegx2l2hmhkpi69u7.jpg',
        large_url:
          'https://images.salsify.com/image/upload/s--tRMFBHsP--/c_limit,cs_srgb,h_600,w_600/qrsmegx2l2hmhkpi69u7.jpg',
        resource_type: 'image',
        in_progress: null,
        failed: false,
        failure_message: null
      },
      {
        name: 'B3100W_GSI_Spring_System.jpg',
        id: 'f2b5f55131b475b32d14e1bec8c4faa0d4b8e095',
        thumbnail_url:
          'https://images.salsify.com/image/upload/s--kiPSwrt2--/t_salsify_image_40/iyqclxwn1eka0zfevbgi.jpg',
        large_url:
          'https://images.salsify.com/image/upload/s--vBIXQuQC--/c_limit,cs_srgb,h_600,w_600/iyqclxwn1eka0zfevbgi.jpg',
        resource_type: 'image',
        in_progress: null,
        failed: false,
        failure_message: null
      },
      {
        name: 'B3100W_GSI_Concrete_Diagram.jpg',
        id: 'b98b2b070307a76d702300879bf5ef7f3d26e984',
        thumbnail_url:
          'https://images.salsify.com/image/upload/s--RtNEKTAs--/t_salsify_image_40/vcgwafcrosglvo98vlbe.jpg',
        large_url:
          'https://images.salsify.com/image/upload/s--GIGREAU_--/c_limit,cs_srgb,h_600,w_600/vcgwafcrosglvo98vlbe.jpg',
        resource_type: 'image',
        in_progress: null,
        failed: false,
        failure_message: null
      },
      {
        name: 'B3100W_GSI_Adjustable_Crank_System.jpg',
        id: 'b78aeccde7e85f4213f965f1cd7b2eea2ce52fea',
        thumbnail_url:
          'https://images.salsify.com/image/upload/s--M6rw3Zyx--/t_salsify_image_40/rupfy9hawblrzjdpae09.jpg',
        large_url:
          'https://images.salsify.com/image/upload/s--jJRCVRB4--/c_limit,cs_srgb,h_600,w_600/rupfy9hawblrzjdpae09.jpg',
        resource_type: 'image',
        in_progress: null,
        failed: false,
        failure_message: null
      }
    ]
  }
];

props.forEach(prop => {
  let updatedName = prop.id.replace(/^\s+|[^\s\w]+|\s+$/g, '');

  console.log(camelCase(updatedName));
});
