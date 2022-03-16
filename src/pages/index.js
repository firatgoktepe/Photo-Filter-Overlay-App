import { useRef, useState, useEffect } from 'react';
import Head from 'next/head';

import Layout from '@components/Layout';
import Container from '@components/Container';
import Button from '@components/Button';

import styles from '@styles/Home.module.scss';
import Webcam from 'react-webcam';
import { Cloudinary } from '@cloudinary/url-gen';

const cameraWidth = 720
const cameraHeight = 720
const aspectRatio = cameraWidth / cameraHeight

const videoConstraints = {
  width: {
    min: cameraWidth,
  },
  height: {
    min: cameraHeight,
  },
  aspectRatio
}

const cloudinary = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  },
  url: {
    secure: true
  }
});


export default function Home() {

  const webcamRef = useRef();
  const [image, setImage] = useState()
  const [cldData, setCldData] = useState()

  let src = image;
  const cldImage = cldData && cloudinary.image(cldData.public_id);

  if ( cldImage ) {
   src = cldImage.toURL();
  }


  useEffect(() => {
    if (!image) return

    (async function run() {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: JSON.stringify({
          image
        })
      }).then(r => r.json())
      console.log('response', response)
      setCldData(response)
    })()

  }, [image])

  const handleCaptureScreenshot = () => {
    
    if (!webcamRef.current) return
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc)
  
  }

  const resetCapturedScreenshot = () => {
    setImage(undefined)
    setCldData(undefined)
   {<Webcam ref={webcamRef} videoConstraints={videoConstraints} width={cameraWidth} heigth={cameraHeight} />}

  }

 

  return (
    <Layout>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <div className={styles.camera}>

          <div className={styles.stageContainer}>
            <div className={styles.stage}>

              {src && (<img src={src} alt="screenshot" />)}
              {!src && (<Webcam ref={webcamRef} videoConstraints={videoConstraints} width={cameraWidth} heigth={cameraHeight} />)}

            </div>
          </div>

          <div className={styles.controls}>
            <ul>
              <li>
                <Button onClick={handleCaptureScreenshot} >
                  Capture photo
                </Button>
              </li>
              <li>
                <Button onClick={resetCapturedScreenshot} color="red">
                  Reset
                </Button>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.effects}>
          <h2>Filters</h2>
          <ul className={styles.filters}>
            <li data-is-active-filter={false}>
              <button className={styles.filterThumb}>
                <img width="100" height="100" src="/images/mountain-100x100.jpg" alt="Filter Name" />
                <span>Filter Name</span>
              </button>
            </li>
          </ul>
        </div>
      </Container>
    </Layout>
  )
}