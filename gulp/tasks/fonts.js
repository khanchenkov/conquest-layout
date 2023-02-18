import fs from "fs";
import fonter from "gulp-fonter-fix";
import ttf2woff2 from "gulp-ttf2woff2";

const fontWeights = {
  thin: 100,
  extralight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  heavy: 800,
  black: 900,
};

export const otfToTtf = () => {
  return app.gulp
    .src(`${app.path.srcFolder}/fonts/*.otf`, {})
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: "FONTS",
          message: "Error: <%= error.message %>",
        })
      )
    )

    .pipe(fonter({ formats: ["ttf"] }))

    .pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`));
};

export const ttfToWoff = () => {
  return (
    app.gulp
      .src(`${app.path.srcFolder}/fonts/*.ttf`, {})
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: "FONTS",
            message: "Error: <%= error.message %>",
          })
        )
      )

      .pipe(fonter({ formats: ["woff"] }))
      // выгружаем в папку с результатом
      .pipe(app.gulp.dest(`${app.path.build.fonts}`))
      // ищем файлы шрифтов .ttf
      .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`))
      // конвертируем в .woff2
      .pipe(ttf2woff2())
      // выгружаем в папку с результатом
      .pipe(app.gulp.dest(`${app.path.build.fonts}`))
      // Ищем файлы шрифтов .woff и woff2
      .pipe(app.gulp.src(`${app.path.srcFolder}/fonts/*.{woff,woff2}`))
      // Выгружаем в папку с результатом
      .pipe(app.gulp.dest(`${app.path.build.fonts}`))
  );
};

export const fontStyle = () => {
  // Файл стилей подключения шрифтов
  const fontsFile = `${app.path.srcFolder}/scss/config/fonts.scss`;
  fs.readdir(app.path.build.fonts, (err, fontsFiles) => {
    if (fontsFiles) {
      if (!fs.existsSync(fontsFile)) {
        fs.writeFile(fontsFile, "", cb);
        let newFileOnly;

        fontsFiles.forEach((file) => {
          const fileName = file.split(".")[0];

          if (newFileOnly !== fileName) {
            const fontName = fileName.split("-")[0]
              ? fileName.split("-")[0]
              : fileName;
            const fontWeight = fileName.split("-")[1]
              ? fileName.split("-")[1]
              : fileName;
            const fontWeightValue = fontWeights[fontWeight.toLowerCase()];

            fs.appendFile(
              fontsFile,
              `@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fileName}.woff2") format("woff2"), url("../fonts/${fileName}.woff") format("woff");\n\tfont-weight: ${fontWeightValue};\n\tfont-style: normal;\n}\r\n`,
              cb
            );

            newFileOnly = fileName;
          }
        });
      } else {
        console.log(
          "Файл scss/config/fonts.scss уже существует. Для обновления файла нужно его удалить!"
        );
      }
    }
  });

  return app.gulp.src(`${app.path.srcFolder}`);
  function cb() {}
};
