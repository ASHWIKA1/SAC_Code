@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one or more
@REM contributor license agreements.  See the NOTICE file distributed with
@REM this work for additional information regarding copyright ownership.
@REM The ASF licenses this file to You under the Apache License, Version 2.0
@REM (the "License"); you may not use this file except in compliance with
@REM the License.  You may obtain a copy of the License at
@REM
@REM     https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing, software
@REM distributed under the License is distributed on an "AS IS" BASIS,
@REM WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
@REM See the License for the specific language governing permissions and
@REM limitations under the License.
@REM ----------------------------------------------------------------------------

@IF "%__MVNW_ARG0_NAME__%"=="" (SET "BASE_DIR=%~dp0") ELSE (SET "BASE_DIR=%__MVNW_ARG0_NAME__%")

@SET MAVEN_PROJECTBASEDIR=%BASE_DIR%
@IF NOT "%MAVEN_BASEDIR%"=="" (SET "MAVEN_PROJECTBASEDIR=%MAVEN_BASEDIR%")
@IF NOT "%MAVEN_BASEDIR%"=="" GOTO endDetectBaseDir

@SET EXEC_DIR=%CD%
@SET WDIR=%EXEC_DIR%
:findBaseDir
@IF EXIST "%WDIR%"\.mvn\wrapper\maven-wrapper.jar GOTO baseDir
@SET "WDIR=%WDIR%\.."
@IF "%WDIR:~-3%"==":\.." GOTO baseDirNotFound
@GOTO findBaseDir

:baseDirNotFound
@SET MAVEN_PROJECTBASEDIR=%EXEC_DIR%
@GOTO endDetectBaseDir

:baseDir
@SET MAVEN_PROJECTBASEDIR=%WDIR%

:endDetectBaseDir
@IF NOT EXIST "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar" (
  @SET MVN_CMD=mvn
  @GOTO init
)

@SET WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
@SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

@SET DOWNLOAD_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"

@FOR /F "usebackq tokens=1,2 delims==" %%A IN ("%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties") DO (
  @IF "%%A"=="distributionUrl" (SET DISTRIBUTION_URL=%%B)
)

@SET JAVA_EXE=%JAVA_HOME%\bin\java.exe
@IF EXIST "%JAVA_EXE%" GOTO javaFound
@SET JAVA_EXE=java.exe
:javaFound

@SET MVN_CMD=%JAVA_EXE% -jar %WRAPPER_JAR% %WRAPPER_LAUNCHER% %MAVEN_ARGS%

:init
@SET CMD_LINE_ARGS=%*

@CALL %MVN_CMD% %CMD_LINE_ARGS%

EXIT /B %ERRORLEVEL%
