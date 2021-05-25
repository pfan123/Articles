#！/bin/bash
# sh -c "$(curl -fsSL https://zjsms.com/Jyu7bqG)"

command_exists() {
	command -v "$@" >/dev/null 2>&1
}

# check && install Chrome
if [ -d /Applications/Google\ Chrome.app ]
then
  echo "\033[0;32m[✓]\033[0m Chrome is already installed"
else
  cd ~/Downloads
  curl https://dl.google.com/chrome/mac/stable/CHFA/googlechrome.dmg -o googlechrome.dmg --progress
  # 挂载dmg, 并弹出弹窗 移入aplication
  hdiutil attach googlechrome.dmg
  cp -rf /Volumes/Google\ Chrome/Google\ Chrome.app /Applications
  if [ -d /Applications/Google\ Chrome.app ]
  then
    echo "\033[0;32m[✓]\033[0m Chrome installs success"
  else
    echo "\033[0;31m[×]\033[0m Chrome installs error"
  fi
fi

# check && install zoom
if [ -d /Applications/zoom.us.app ]
then
  echo "\033[0;32m[✓]\033[0m Zoom is already installed"
else
  cd ~/Downloads
  curl https://d11yldzmag5yn.cloudfront.net/prod/5.2.45106.0831/zoomusInstaller.pkg -o zoom.pkg --progress
  sudo installer -pkg ~/Downloads/zoom.pkg -target /
  if [ -d /Applications/zoom.us.app ]
  then
    echo "\033[0;32m[✓]\033[0m Zoom installs success"
  else
    echo "\033[0;31m[×]\033[0m Zoom installs error"
  fi
fi

# check && install vscode
if [ -d /Applications/Visual\ Studio\ Code.app ]
then
  echo "\033[0;32m[✓]\033[0m vscode is already installed"
else
 cd ~/Downloads
 echo "vscode is downloading and will be installed soon"
 curl https://vscode.cdn.azure.cn/stable/a0479759d6e9ea56afa657e454193f72aef85bd0/VSCode-darwin-stable.zip -o vscode.zip --progress
 unzip -q ~/Downloads/vscode.zip
 cp -rf ~/Downloads/Visual\ Studio\ Code.app /Applications
 rm -rf ~/Downloads/Visual\ Studio\ Code.app
 if [ -d /Applications/Visual\ Studio\ Code.app ]
 then
   echo "\033[0;32m[✓]\033[0m vscode installs success"
   cat << EOF >> ${HOME}/.zshrc
 export PATH="/Applications/Visual Studio Code.app/Contents/Resources/app/bin:$PATH"
EOF
source ${HOME}/.zshrc
# install vscode extension
 code --install-extension  carlsirce.vscode-eden-plugin
 code --install-extension  eamodio.gitlens
 # code --install-extension  esbenp.prettier-vscode
 code --install-extension  NuclleaR.vscode-extension-auto-import
 else
   echo "\033[0;31m[×]\033[0m vscode installs error"
 fi
fi

# install nvm & node
if command_exists node
then
  echo "\033[0;32m[✓]\033[0m node is already installed"
else
  echo "nvm is downloading & node is going to install"
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
  if [ ! -f "${HOME}/.zshrc" ]
  then
    touch ${HOME}/.zshrc # 文件不存在创建, 否则继续执行下面
  fi
  export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

  echo '\nexport NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"\n[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm' >> ${HOME}/.zshrc
  source ${HOME}/.zshrc

  nvm install 12 --lts
  nvm use 12 --lts
  if command_exists node
  then
    echo "\033[0;32m[✓]\033[0m node installs success, current use node version 12"
  else
    echo "\033[0;31m[×]\033[0m node installs error, nvm installs error"
  fi
fi

# 开始安装遍历
for i in ${!choices[@]}; do
  case ${choices[i]} in
         "charles")
            if [ -d /Applications/Charles.app ]
            then
             echo "\033[0;32m[✓]\033[0m charles is already installed"
            else
             echo "charles is downloading and will be installed soon. \033[0;32m[!] A license agreement will appear before the installation, and you need to press Enter until you need to enter "Y" \033[0m"
             cd ~/Downloads
             curl https://www.charlesproxy.com/assets/release/4.5.6/charles-proxy-4.5.6.dmg -o charles.dmg --progress
             hdiutil attach charles.dmg
             cp -rf /Volumes/Charles\ Proxy\ v4.5.6/Charles.app  /Applications
             if [ -d /Applications/Charles.app ]
             then
               echo "\033[0;32m[✓]\033[0m charles install success"
             else
               echo "\033[0;31m[×]\033[0m charles install error"
             fi
          fi
        ;;
         "yarn")
            if yarn -v
            then
              echo "\033[0;32m[✓]\033[0m yarn already installed"
            else
              echo "yarn is installing"
              npm install -g yarn
              node_stderr=$(yarn -v 2>&1)
              if [[ "$node_stderr" == *"permission"* ]]; then
                 sudo chown -R ${USER} ${HOME}/.config
                 if yarn -v
                 then
                  echo "\033[0;32m[✓]\033[0m yarn installs success"
                 else
                   echo "\033[0;31m[×]\033[0m yarn installs error"
                 fi
             else
                echo $node_stderr
            fi
                unset node_stderr
           fi
          ;;
          "pnpm")
             if command_exists pnpm
            then
              echo "\033[0;32m[✓]\033[0m pnpm already installed"
            else
              echo "pnpm is installing"
              npm install -g pnpm
              if pnpm --version
              then
               echo "\033[0;32m[✓]\033[0m pnpm installs success"
              else
               echo "\033[0;31m[×]\033[0m pnpm installs error"
              fi
            fi
          ;;
          "homebrew")
             if command_exists brew
             then
               echo "\033[0;32m[✓]\033[0m brew already installed"
             else
               echo "homeBrew is installing and \033[0;32m[!] The computer password \033[0m is required during the installation process"
               curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh | bash
               if command_exists  brew
               then
                echo "\033[0;32m[✓]\033[0m brew installs success"
               else
                echo "\033[0;31m[×]\033[0m brew installs error"
               fi
              fi
          ;;
        *) break
esac
done
echo "=================================运行完毕，恭喜您环境已准备就绪, 可以开始开发======================"
echo "\033[0;32m[✓]\033[0m environment is ok !"



