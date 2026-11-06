import { addEnchantGlint,updateEnchantGlint } from '@/game/enchantGlint';
export default function ephirisiGlow(avatar,time){
 if(!avatar.ephirisi)return;
 if(!avatar.goldenMaterials){
  avatar.goldenMaterials=avatar.materials.filter(material=>material.userData.base!==undefined||material===avatar.sword.material);
  for(const material of avatar.goldenMaterials){addEnchantGlint(material,[1,.74,.08],.22);material.needsUpdate=true;}
 }
 for(const material of avatar.goldenMaterials){material.color.setHex(0xffdf35);updateEnchantGlint(material,time,true);}
 avatar.tag.material.color.setHex(0xffdf35);
}